const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const { listingsSchema } = require('../utils/schema');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../utils/middleware');

const validateListing = (req, res, next) => {
    let result = listingsSchema.validate(req.body);
    console.log(result);

    if (result.error) {
        let error = result.error.details.map(err => err.message).join(',');
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// New listing form
router.get('/new', isLoggedIn,(req, res) => {
    
    res.render('listings/new.ejs');
});

// Show form to create new listing
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    } 
    res.render("listings/show.ejs", { listing });
}));

// Create new listing
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect("/listings");
}));

// Edit listing form
router.get('/:id/edit',isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update listing
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, 'Invalid Listing Data, please send a valid listing data');
    }
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${updatedListing._id}`);
}));

// Delete listing
router.delete('/:id',isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a listing!');
    res.redirect('/listings');
}));

module.exports = router;