const express = require("express");
const router = express.Router(); // Create a new router instance for handling routes
const controllers = require("../controllers/controllers"); // Import the controllers for handling route logic
const authorize = require("../authorize"); // Import custom authorization middleware
const passport = require("../passport");

// Route for the home page
router.get("/", controllers.home);

// Routes for handling user-related operations
router.get("/users", controllers.getUsers); // Get a list of all users
router.get("/users/:id", controllers.getUserById); // Get details of a specific user by ID
router.post("/users", controllers.createUser); // Create a new user
router.get("/myinfo", controllers.getMyInfo);
router.post("/google-login", controllers.googleLogin);

router.delete("/users/:id", controllers.deleteUser); // Delete a specific user by ID

// Route for updating a user's details
router.put("/users/:id", controllers.updateUser); // Update a specific user's details by ID

// Route for triggering an error (for testing purposes)
router.get("/error", controllers.error); // This could be used for error handling tests or debugging

// Routes for authentication-related operations
router.post("/login", controllers.logIn); // Handle user login
router.post("/signup", controllers.signUp); // Handle user sign up
router.get("/logout", authorize, controllers.logOut); // Handle user logout (protected by authorization middleware)

module.exports = router;
