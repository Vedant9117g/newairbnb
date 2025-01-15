const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body; // Fix: req.body instead of res.body
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // Register the user
        console.log(registeredUser);

        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", error.message); 
        res.redirect("/signup"); 
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});


// Login Route
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        res.redirect("/listings");
    }
);

module.exports = router;
