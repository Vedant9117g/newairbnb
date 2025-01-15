const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { reviewsSchema } = require('../utils/schema');
const ExpressError = require('../utils/ExpressError');

const validateReview = (req, res, next) => {
    let result = reviewsSchema.validate(req.body);
    console.log(result);

    if (result.error) {
        let error = result.error.details.map(err => err.message).join(',');
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

router.post('/', validateReview, wrapAsync(async (req, res) => {  
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'Successfully added a new review!');
    res.redirect(`/listings/${listing._id}`);
}));

router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;