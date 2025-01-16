const Listing = require("../models/listing");

module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm =(req, res) => {
    
    res.render('listings/new.ejs');
};

module.exports.showListing =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('owner');
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    } 
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing =async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect("/listings");
};

module.exports.renderEditForm =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing =async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, 'Invalid Listing Data, please send a valid listing data');
    }
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${updatedListing._id}`);
};

module.exports.deleteListing =async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a listing!');
    res.redirect('/listings');
};