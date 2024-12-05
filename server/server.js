//This file runs the backend server
// Load environment variables from a specified .env file
require('dotenv').config({ path: './server/mongo.env' });
console.log('MONGO_URI:', process.env.MONGO_URI); // Log the MongoDB connection URI (for debugging)

// Import required modules
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing
const express = require('express'); // Framework for building web applications
const lessonsRoutes = require('./routes/lessons'); // Import routes for handling lesson-related operations
const ordersRoutes = require('./routes/orders'); // Import routes for handling order-related operations
const logger = require('./middleware/logger'); // Middleware for logging server requests
const staticMiddleware = require('./middleware/static'); // Middleware for serving static files (e.g., images)

// Initializing the Express app
const app = express();
const PORT = process.env.PORT || 3000; // Set the port from environment variable or default to 3000

// Enable CORS (Cross-Origin Resource Sharing) for the front-end application
app.use(cors({
  origin: 'http://127.0.0.1:5500' // Live Server URL used for the front-end
}));

// Middleware
app.use(logger); // Log all incoming requests to the console
app.use(express.json()); // Automatically parse JSON data in request bodies
app.use('/images', staticMiddleware); // Serve static files (e.g., lesson images) from a specified directory

// Retrieve the MongoDB connection URI from the environment variables
const uri = process.env.MONGO_URI;

// Check if the MongoDB URI is defined, terminate the server if not
if (!uri) {
  console.error('Error: MONGO_URI is undefined. Please check your .env file.');
  process.exit(1); // Exit the application with an error code
}

// Connect to MongoDB using the native MongoDB driver
const { MongoClient } = require('mongodb');
MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB'); // Log successful connection
    const db = client.db('lessonsBookingApp'); // Access the lessonsBookingApp database
    app.locals.db = db; // Attach the database object to the app.locals for use in routes
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error); // Log any connection errors
    process.exit(1); // Exit the application if the connection fails
  });

// Define routes for the application
app.use('/lessons', lessonsRoutes); // Handle all /lessons-related API requests
app.use('/orders', ordersRoutes); // Handle all /orders-related API requests

// Start the server and listen for incoming requests
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));