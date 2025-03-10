const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../utils/middleware');

const reviewController = require('../controllers/review');

router.post('/', validateReview,isLoggedIn, wrapAsync(reviewController.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;