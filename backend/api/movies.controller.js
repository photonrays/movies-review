// thang - 20521895
import MoviesDAO from '../dao/moviesDAO.js';
export default class MoviesController {
    static async apiGetMovies(req, res, next) {
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;
        let filters = {};
        if (req.query.rated) {

            filters.rated = req.query.rated;

        }
        else if (req.query.title) {

            filters.title = req.query.title;

        }
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
            filters, page,
            moviesPerPage
        });
        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        };
        res.json(response);
    }

    // thang - 20521895
    static async apiGetMovieById(req, res, next) {
        try {
            const id = req.params.id;
            const movieDetail = await MoviesDAO.getMovieById({ id })
            res.json(movieDetail);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getRatings(req, res, next) {
        try {
            const ratings = await MoviesDAO.getRatings();
            res.json(ratings);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}