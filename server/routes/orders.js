// Route for handling orders
// Import required modules
const express = require('express'); // Framework for creating APIs and web applications
const { ObjectId } = require('mongodb'); // Utility for working with MongoDB Object IDs
const router = express.Router(); // Create a new router for handling order-related routes

// POST route to create a new order
// This route handles the creation of an order and updates the lesson spaces accordingly
router.post('/', async (req, res) => {
  const db = req.app.locals.db; // Access the MongoDB database instance
  const order = req.body; // Get the order details from the request body
  // Example order structure:
  // { name, phone, lessons: [{ lessonId, spaces }] }

  try {
    // Loop through each lesson in the order to update the available spaces
    for (const lesson of order.lessons) {
      // Deduct the number of spaces specified in the order from the corresponding lesson
      await db.collection('lessons').updateOne(
        { _id: new ObjectId(lesson.lessonId) }, // Match the lesson by its ObjectId
        { $inc: { spaces: -lesson.spaces } } // Decrease the "spaces" field by the specified amount
      );
    }

    // Save the order details to the "orders" collection in MongoDB
    const result = await db.collection('orders').insertOne(order);

    // Respond with a success message and the generated order ID
    res.json({ message: 'Order created', orderId: result.insertedId });
  } catch (error) {
    // Log any errors that occur during the operation
    console.error('Error creating order:', error);

    // Respond with an error message and a 500 status code
    res.status(500).json({ error: 'An error occurred while creating the order.' });
  }
});

// GET route to fetch all orders
// This route retrieves all orders from the "orders" collection in MongoDB
router.get('/', async (req, res) => {
  const db = req.app.locals.db; // Access the MongoDB database instance
  try {
    // Retrieve all orders from the "orders" collection
    const orders = await db.collection('orders').find().toArray();

    // Respond with the orders in JSON format
    res.json(orders);
  } catch (error) {
    // Log any errors that occur during the operation
    console.error('Error fetching orders:', error);

    // Respond with an error message and a 500 status code
    res.status(500).json({ error: 'An error occurred while fetching orders.' });
  }
});

// Export the router to be used in the main server file(server.js)
module.exports = router;