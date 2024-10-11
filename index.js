const express = require("express"); // server framework for Node.js
const dotenv = require("dotenv"); // Loads enviroment variables from .env file
const morgan = require("morgan"); // middleware for logging HTTP request
require("express-async-errors"); // automatically handle errors in async functions
const cors = require("cors"); // middleware to enable Cross-Origing Resource Sharing
const cookieParser = require("cookie-parser"); // Import cookie-parser
const https = require("https");
const http = require("http");
const fs = require("fs");

dotenv.config({
  path: process.env.ENV_PATH || ".env",
});

// Loads enviroment variables from .env file
const app = express();
const port = process.env.PORT; // Gets the port from .env file
const portHTTPS = process.env.PORTHTTPS; // Gets the port from .env file

const mainRoutes = require("./routes/mainRoutes"); // imports the main routes

const client = process.env.URL_CLIENT;
const server = process.env.URL_SERVER;

// Certificate
const privateKey = fs.readFileSync("./certs/privkey.pem", "utf8");
const certificate = fs.readFileSync("./certs/cert.pem", "utf8");
const ca = fs.readFileSync("./certs/chain.pem", "utf8");

credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

// middlewares
app.use(express.json()); // To accept JSON from the client
app.use(morgan("tiny")); // To log the client's request in the tiny format
app.use(
  cors({
    origin: client, // to change the backend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // To enable cookies to be sent
  })
); // to allow request from different domains. To enable CORS
app.use(cookieParser()); // To handle cookies

// Main routes
app.use("/", mainRoutes); // To get all routes from mainRoutes.js

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // log the error stack trace to the console
  // send a 500 internal server Error response with the error message
  res.status(500).send({ error: err.message });
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(port, () => {
  console.log(`http server listening on: ${server}:${port}`); // log the server start message with the port
});

httpsServer.listen(portHTTPS, () => {
  console.log(`https server listening on: ${server}:${portHTTPS}`); // log the server start message with the port
});
