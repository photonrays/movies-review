// thang - 20521895
import React, { useEffect, useState } from "react";
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container';

function MoviesList(props) {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchRating, setSearchRating] = useState("");
  const [ratings, setRatings] = useState(["All Ratings"]);

  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);

  const [currentSearchMode, setCurrentSearchMode] = useState("");



  // thang - 20521895
  useEffect(() => {
    retrieveMovies();
    retrieveRatings();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  useEffect(() => {
    //retrieveMovies();
    retrieveNextPage();
  }, [currentPage]);

  const retrieveNextPage = () => {
    if (currentSearchMode === "findByTitle")
      findByTitle();
    else if (setCurrentSearchMode === "findByRating")
      findByRating();
    else
      retrieveMovies();
  }


  // thang - 20521895
  const retrieveMovies = () => {
    setCurrentSearchMode("");
    MovieDataService.getAll(currentPage)
      .then(response => {
        console.log(response.data);
        setMovies(response.data.movies);
        setCurrentPage(response.data.page);
        setEntriesPerPage(response.data.entries_per_page);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const retrieveRatings = () => {
    MovieDataService.getRatings()
      .then(response => {
        console.log(response.data);
        //start with 'All ratings' if user doesn't specify any ratings
        setRatings(["All Ratings"].concat(response.data));
      })
      .catch(e => {
        console.log(e);
      });
  }

  // thang - 20521895
  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  }
  const onChangeSearchRating = e => {
    const searchRating = e.target.value;
    setSearchRating(searchRating);
  }

  // thang - 20521895
  const find = (query, by) => {
    console.log(query)
    MovieDataService.find(query, by, currentPage)
      .then(response => {
        console.log(response.data);
        setMovies(response.data.movies);
      })
      .catch(e => {
        console.log(e);
      });
  }
  const findByTitle = () => {
    setCurrentSearchMode("findByTitle")
    find(searchTitle, "title");
  }
  const findByRating = () => {
    setCurrentSearchMode("findByRating")
    if (searchRating === "All Ratings") {
      retrieveMovies();
    }
    else {
      find(searchRating, "rated");
    }
  }

  // thang - 20521895
  return (
    <div className="App">
      <Container>
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={onChangeSearchTitle}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="button"
                onClick={findByTitle}
              >
                Search
              </Button>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control
                  as="select" onChange={onChangeSearchRating} >
                  {ratings.map((rating, index) => {
                    return (
                      <option key={index} value={rating}>{rating}</option>
                    )
                  })}
                </Form.Control>
              </Form.Group>
              <Button
                variant="primary"
                type="button"
                onClick={findByRating}
              >
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        {/*thang - 20521895*/}
        <Row>
          {movies.map((movie, index) => {
            return (
              <Col key={index}>
                <Card style={{ width: '18rem' }}>
                  <Card.Img src={movie.poster + "/100px180"} />
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text>
                      Rating: {movie.rated}
                    </Card.Text>
                    <Card.Text>{movie.plot}</Card.Text>
                    <Link to={"/movies/" + movie._id}>View Reviews</Link>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/*thang - 20521895*/}
        <br />
        Showing page: {currentPage}.
        <Button
          variant="link"
          onClick={() => { setCurrentPage(currentPage + 1) }}>
          Get next {entriesPerPage} results
        </Button>
      </Container>
    </div>
  );
}


export default MoviesList;
