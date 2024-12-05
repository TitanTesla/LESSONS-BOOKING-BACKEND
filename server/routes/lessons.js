// This is a route that handles lessons
// Import necessary modules
const express = require('express'); // Framework for building web applications
const { ObjectId } = require('mongodb'); // Utility for working with MongoDB Object IDs
const router = express.Router(); // Create a new router for handling lesson routes

// GET all lessons
// This route fetches all the lessons from the database
router.get('/', async (req, res) => {
  const db = req.app.locals.db; // Access the database object attached to app.locals
  try {
    const lessons = await db.collection('lessons').find().toArray(); // Fetch all lessons as an array
    res.json(lessons); // Respond with the lessons in JSON format
  } catch (error) {
    console.error('Error fetching lessons:', error); // Log any errors
    res.status(500).json({ message: 'Failed to fetch lessons' }); // Send an error response if something goes wrong
  }
});

// PUT to update any lesson attributes
// This route updates specific attributes of a lesson based on its ID
router.put('/:id', async (req, res) => {
  const db = req.app.locals.db; // Access the database object
  const { id } = req.params; // Get the lesson ID from the route parameters
  const updates = req.body; // Get the updated attributes from the request body

  try {
    // Update the lesson in the database by its ObjectId
    const result = await db.collection('lessons').updateOne(
      { _id: new ObjectId(id) }, // Match the lesson with the specified ID
      { $set: updates } // Set the attributes to be updated
    );

    // Check if the lesson was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Lesson not found' }); // Respond with 404 if no match is found
    }

    res.json({ message: 'Lesson updated successfully' }); // Respond with a success message
  } catch (error) {
    console.error('Error updating lesson:', error); // Log any errors
    res.status(500).json({ message: 'Failed to update lesson' }); // Send an error response if something goes wrong
  }
});

// Export the router to use it in the main server file(server.js)
module.exports = router;