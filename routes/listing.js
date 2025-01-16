const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../utils/middleware');
const listingController = require('../controllers/listing');




router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));



// New listing form
router.get('/new', isLoggedIn, listingController.renderNewForm);

router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



// Edit listing form
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;