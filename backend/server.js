const express = require("express");
const mysql = require("mysql2");  // Use mysql2 for better support
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const cloudinary = require('cloudinary').v2;

// Initialize the app and middleware
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Initialize multer for file uploads
const upload = multer();

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'docuawff2',
  api_key: '368667218665533',
  api_secret: 'AF3nNzF3u2nIs2Ri_f2tea5w1LQ'
});

// MySQL Database connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kemas_861",  // Update to match your MySQL password
  database: "sharerippy",
});

// Connect to the database with error handling
db.connect(err => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    process.exit(1);  // Exit the process if the database connection fails
  }
  console.log("Connected to database.");
});

// ---------------- Recipe Routes ----------------

// Endpoint to retrieve all recipes
app.get('/subrecipe', (req, res) => {
  const sql = "SELECT * FROM recipe";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data: " + err.message);
      return res.status(500).json(err);
    }
    res.json(data);
  });
});

// Endpoint to retrieve a recipe by ID
app.get('/recipe/:id', (req, res) => {
  const recipeId = req.params.id;
  const sql = "SELECT * FROM recipe WHERE id = ?";
  db.query(sql, [recipeId], (err, data) => {
    if (err) {
      console.error("Error retrieving recipe details: " + err.message);
      return res.status(500).json(err);
    }
    res.json(data[0]); // Return the first item in the result array
  });
});

// Endpoint to submit a new recipe with an image
app.post('/subrecipe', upload.single('image'), (req, res) => {
  try {
    const { recipeName, description, ingredients, cookingSteps, difficulty, category } = req.body;
    const image = req.file;

    if (image) {
      console.log("Image file received:", image.originalname);

      // Upload the image to Cloudinary
      cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error("Error uploading image to Cloudinary:", error.message);
            return res.status(500).json({ error: "Failed to upload image" });
          }
          const imageUrl = result.secure_url; // Get the URL of the uploaded image

          // After uploading the image, insert the recipe data into the database
          const sql = "INSERT INTO recipe (recipeName, description, ingredients, cookingSteps, difficulty, category, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)";
          const values = [
            recipeName,
            description,
            ingredients,
            cookingSteps,
            difficulty,
            category,
            imageUrl  // Save the Cloudinary image URL in the database
          ];

          db.query(sql, values, (err, data) => {
            if (err) {
              console.error("Error inserting data: " + err.message);
              return res.status(500).json({ error: err.message });
            }
            res.json(data);
          });
        }
      ).end(image.buffer);  // Stream the image buffer to Cloudinary
    } else {
      console.log("No image file received.");
      // Insert the recipe data into the database without an image URL
      const sql = "INSERT INTO recipe (recipeName, description, ingredients, cookingSteps, difficulty, category, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        recipeName,
        description,
        ingredients,
        cookingSteps,
        difficulty,
        category,
        null  // No image URL, null value
      ];

      db.query(sql, values, (err, data) => {
        if (err) {
          console.error("Error inserting data: " + err.message);
          return res.status(500).json({ error: err.message });
        }
        res.json(data);
      });
    }
  } catch (err) {
    console.error("Unexpected error occurred: " + err.message);
    res.status(500).json({ error: "Server error, please try again later." });
  }
});

// ---------------- Authentication Routes ----------------

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const query = 'SELECT email FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Error querying MySQL:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, email, hashedPassword], (err, results) => {
        if (err) {
          console.error('Error inserting into MySQL:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (err) {
    console.error('Error in registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Query to find user by email
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error querying MySQL:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Successful login
      res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    });
  });
});

// Endpoint to search for recipes based on a query
app.get('/search', (req, res) => {
  const searchQuery = req.query.query; // Get the search query from the URL

  // Ensure searchQuery is not empty
  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  console.log("Search Query Received:", searchQuery); // Log received query

  // SQL query to search within the recipe table
  const sql = 
    `SELECT * FROM recipe 
    WHERE recipeName LIKE ? 
    OR description LIKE ? 
    OR ingredients LIKE ? 
    OR cookingSteps LIKE ?`;

  const searchValue = `%${searchQuery}%`;
  const values = [searchValue, searchValue, searchValue, searchValue];

  // Execute the query
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error executing search query: " + err.message);
      return res.status(500).json({ error: err.message });
    }

    console.log("Search Results:", data); // Log results
    res.json(data); // Send the matched results as a response
  });
});

// Endpoint to get user information
app.get('/api/user', (req, res) => {
  const userId = req.query.userId || 1; // Replace with actual user ID from auth middleware or session
  const sql = 'SELECT username, email FROM users WHERE id = ? ORDER BY id DESC LIMIT 1';
  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error('Error fetching user info:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(data[0]); // Send the latest user data as the response
  });
});

// Endpoint to delete a recipe by ID
app.delete('/subrecipe/:id', (req, res) => {
  const recipeId = req.params.id;
  
  // SQL query to delete a recipe by ID
  const sql = "DELETE FROM recipe WHERE id = ?";
  
  db.query(sql, [recipeId], (err, result) => {
    if (err) {
      console.error("Error deleting recipe: " + err.message);
      return res.status(500).json({ error: "Failed to delete recipe" });
    }
    
    if (result.affectedRows === 0) {
      // If no rows were affected, the recipe ID might not exist
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    // Successfully deleted
    res.json({ message: "Recipe deleted successfully" });
  });
});

// API endpoint to fetch recipe details
app.get('/recipe/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM Recipes WHERE id = ?`;
  db.query(query, id, (err, results) => {
    if (err) {
      console.error('Error fetching recipe details:', err);
      res.status(500).send({ message: 'Error fetching recipe details' });
    } else {
      res.json(results[0]);
    }
  });
});

// API endpoint to fetch comments for a recipe
app.get('/recipe/:id/comments', (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM Comments WHERE recipe_id = ?`;
  db.query(query, id, (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).send({ message: 'Error fetching comments' });
    } else {
      res.json(results);
    }
  });
});

// API endpoint to submit a new comment
app.post('/recipe/:id/comments', (req, res) => {
  const id = req.params.id;
  const { name, comment, rating } = req.body;
  const query = `INSERT INTO Comments (recipe_id, username, comment_text, rating) VALUES (?, ?, ?, ?)`;
  db.query(query, [id, name, comment, rating], (err, results) => {
    if (err) {
      console.error('Error submitting comment:', err);
      res.status(500).send({ message: 'Error submitting comment' });
    } else {
      res.json({ message: 'Comment submitted successfully' });
    }
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
