// thang - 20521895
let movies;
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

export default class MoviesDAO {
    static async injectDB(conn) {
        if (movies) {
            return;
        }
        try {
            movies = await
                conn.db(process.env.MOVIEREVIEWS_NS).collection('movies');
        }
        catch (e) {
            console.error(`unable to connect in MoviesDAO: ${e}`);
        }
    }
    static async getMovies({// default filter
        filters = null,
        page = 0,
        moviesPerPage = 20, // will only get 20 movies at once
    } = {}) {
        let query;
        if (filters) {
            if ("title" in filters) {
                query = { $text: { $search: filters['title'] } };
            } else if ("rated" in filters) {
                query = { "rated": { $eq: filters['rated'] } }
            }
        }
        let cursor;
        try {
            cursor = await movies.find(query).limit(moviesPerPage).skip(moviesPerPage * page);
            const moviesList = await cursor.toArray();
            const totalNumMovies = await movies.countDocuments(query);
            return { moviesList, totalNumMovies };
        }
        catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { moviesList: [], totalNumMovies: 0 };
        }
    }

    // thang - 20521895
    static async getMovieById({ id }) {
        const query = [
            { $match: { _id: new ObjectId(id.toString()) } },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "movie_id",
                    as: "reviews"
                }
            },
        ]
        let cursor;
        try {
            cursor = await movies.aggregate(query)
            const movieDetail = await cursor.next();;
            return movieDetail;
        }
        catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return {};
        }
    }

    // thang - 20521895
    static async getRatings() {
        let ratedTypes = [];

        try {
            ratedTypes = await movies.distinct("rated");
        } catch (error) {
            console.error(`Unable to get rated types in moviesDAO: ${error}`);
        }

        return ratedTypes;
    }
}