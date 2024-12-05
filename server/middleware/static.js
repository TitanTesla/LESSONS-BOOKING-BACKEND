// This file is used for handling images  
const path = require('path'); // Required for working with file and directory paths
const fs = require('fs'); // Required for file system operations

// Middleware to serve static files (e.g., lesson images) from the "images" directory
module.exports = (req, res) => {
  const fileName = req.url.replace('/', ''); // Extract the file name from the request URL
  const filePath = path.join(__dirname, '../images', fileName); // Build the full file path

  // Check if the request does not include a file name
  if (!fileName) {
    res.status(400).send({ error: 'File name is required' }); // Respond with a 400 error
    return;
  }

  // Check if the file exists in the directory
  fs.access(filePath, fs.constants.F_OK, err => {
    if (err) {
      // File not found, respond with a 404 error
      res.status(404).send({ error: 'Image not found' });
    } else {
      // File exists, serve the file
      res.sendFile(filePath);
    }
  });
};