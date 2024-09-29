const db = require("./database/db") // Import the database module for database operations
const dotenv = require("dotenv"); // for enviroment variables
dotenv.config(); // Load environment variables from .env file
const passport = require("passport");  // Import Passport.js for authentication
const passportJWT = require("passport-jwt"); // Import Passport JWT strategy for handling JSON Web Tokens

// Retrieve the secret key from environment variables
const SECRET = process.env.SECRET;

// Set up the Passport JWT authentication strategy
passport.use(
  new passportJWT.Strategy(
    {
       // Configure the JWT strategy
      secretOrKey: SECRET, // Use the secret key for verifying the JWT
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract the JWT from the Authorization header as a Bearer token
    },
    // Define the callback function to handle the JWT payload
    async(payload, done) => {
      // Retrieve the user from the database using the ID from the JWT payload
        const user = db.one(`SELECT * FROM users WHERE id=$1`, payload.id)
        console.log(user) // Log the user object for debugging purposes

        try{
            // If the user exists, return the user object, otherwise return an error
            return user? done(null, user) : done(new Error("User not found."))
        }catch(error){
          // If there is an error during the database operation, pass the error to done()
            done(error)
        }
    })

);
