const passport = require("passport"); // Import the Passport.js library for authentication

// Define the `authorize` middleware function for protecting routes
function authorize(req, res, next) {
  // Use Passport's `authenticate` method with the 'jwt' strategy
  passport.authenticate("jwt", { session: false }, (err, user) => {
        // If there's an error or no user is authenticated, respond with a 401 Unauthorized status
    if (!user || err) {
      res.status(401).json({ msg: "Unauthorized." });
    } else {
       // If authentication is successful, attach the user to the request object
      req.user = user;
      // Proceed to the next middleware or route handler
      next();
    }
  })(req, res, next); // Invoke the passport.authenticate method with the request and response objects
}

module.exports = authorize;
