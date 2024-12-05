// Middleware function to log all incoming requests
// Logs the HTTP method and URL of each request
module.exports = (req, res, next) => {
  console.log(`${req.method} ${req.url}`); // Example: "GET /lessons"
  next(); // Proceed to the next middleware or route handler
};