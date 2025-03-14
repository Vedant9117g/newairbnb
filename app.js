require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const { listingsSchema, reviewsSchema } = require('./utils/schema');
const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/user');


const app = express();
const port = 8080;
const MONGO_URL = 'mongodb://127.0.0.1:27017/newairbnb';

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
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionOption = {
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOption));


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user
    next();
});


app.get("/demouser",async(req,res)=>{

    let fakeUser = new User
    ({
        email:"studen@gmail.com",
        username:"ved"
    });

    let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
});



app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
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