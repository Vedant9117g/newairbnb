const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/listing');
const app = express();
const ejsMate = require('ejs-mate');
const port = 8080;
const MONGO_URL = 'mongodb://127.0.0.1:27017/newairbnb';
const methodOverride = require('method-override');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const listingSchema = require('./utils/schema');

// Connect to MongoDB
mongoose
    .connect(MONGO_URL)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.log('Connection error:', err));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.engine('ejs',ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateListing = (req, res, next) => {
    let result = listingSchema.listingsSchema.validate(req.body);
    console.log(result);

    if (result.error) {
        let error = result.error.details.map(err => err.message).join(',');
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// New listing form
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Show form to create new listing
app.get('/listings/:id',wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// Create new listing
app.post('/listings',validateListing, wrapAsync (async (req, res,next ) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, 'Invalid Listing Data , please send a valid listing data');
    // };
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Edit listing form
app.get('/listings/:id/edit',wrapAsync( async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

/// Update listing
app.put('/listings/:id', validateListing ,wrapAsync(async (req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400, 'Invalid Listing Data , please send a valid listing data');
    };
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    res.redirect(`/listings/${updatedListing._id}`);
}));

// Delete listing
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));


// app.get('/test', async (req, res) => {
//   let sampleListing = new Listing({
//     title: 'Sample Listing',
//     description: 'This is a sample listing',
//     price: 100,
//     location: 'San Francisco',
//     country: 'USA',
//   });
//   await sampleListing.save();
//   console.log('Sample listing saved');
//   res.send('Sample listing success');
// });

app.all('*', (req, res, next) => {
    next(new ExpressError(404,'Page Not Found'));
});


// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('listings/error', { statusCode, message });
});


// Start the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
