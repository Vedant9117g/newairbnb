const User = require("../models/user");

module.exports.renderSignup =(req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body; // Fix: req.body instead of res.body
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // Register the user
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    console.log("Logged in User:", req.user); 
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash("error", "Something went wrong");
            return res.redirect("/listings");
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });

};