// thang - 20521895
import express from 'express';
import MoviesController from './movies.controller.js';
import ReviewsController from './reviews.controller.js'

const router = express.Router(); // get access to express router

router.route('/').get(MoviesController.apiGetMovies);

// thang - 20521895
router.route('/ratings').get(MoviesController.getRatings)
router.route('/:id').get(MoviesController.apiGetMovieById);

router
    .route('/review')
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview);

export default router;