const Listing = require('../models/listing');       
const review = require('../models/review');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const { listingsSchema,reviewsSchema } = require('../utils/schema');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id , reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let result = listingsSchema.validate(req.body);
    console.log(result);

    if (result.error) {
        let error = result.error.details.map(err => err.message).join(',');
        throw new ExpressError(400, error);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    let result = reviewsSchema.validate(req.body);
    console.log(result);

    if (result.error) {
        let error = result.error.details.map(err => err.message).join(',');
        throw new ExpressError(400, error);
    } else {
        next();
    }
};
