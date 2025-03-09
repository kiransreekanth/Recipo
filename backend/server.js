const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const Saved = require('./models/Saved');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("DB connected successfully..."))
.catch(err => console.error("DB connection error:", err));

// Home page API
app.get('/', (req, res) => {
    res.send("Welcome to the MERN stack session");
});

// User Registration API
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User Registered Successfully" });
        console.log("User Registration Completed...");
    } catch (err) {
        console.error("Error in Registration:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// User Login API with JWT
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        
        res.json({ 
            message: "Login Successful", 
            token, 
            username: user.username,
            userId: user._id
        });
        console.log("User logged in successfully...");
    } catch (err) {
        console.error("Error in Login:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Middleware for authentication
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized, token missing or incorrect format" });
        }

        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Add Recipe API (Protected Route)
app.post('/add-recipe', authenticate, async (req, res) => {
    const { title, category, ingredients, instructions, image } = req.body;

    try {
        if (!title || !category || !ingredients || !instructions) {
            return res.status(400).json({ message: "All fields except image are required!" });
        }

        const recipe = new Recipe({ title, category, ingredients, instructions, image, user: req.user.userId });
        await recipe.save();

        res.status(201).json({ message: "Recipe Added Successfully" });
        console.log("New Recipe Added...");
    } catch (err) {
        console.error("Error in Adding Recipe:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Fetch all recipes
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        console.error("Error fetching recipes:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Fetch a single recipe by ID
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (err) {
        console.error("Error fetching recipe:", err);
        
        // Check if error is due to invalid ID format
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }
        
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update a recipe (Protected Route with Ownership Validation)
app.put('/recipes/:id', authenticate, async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.userId;
        
        // First find the recipe to check ownership
        const recipe = await Recipe.findById(recipeId);
        
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        
        // Check if the current user is the owner of the recipe
        if (recipe.user.toString() !== userId) {
            return res.status(403).json({ message: "You don't have permission to update this recipe" });
        }
        
        // If owner, proceed with update
        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, { new: true });
        res.status(200).json({ message: "Recipe updated successfully", recipe: updatedRecipe });
    } catch (err) {
        console.error("Error updating recipe:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete a recipe (Protected Route with Ownership Validation)
app.delete('/recipes/:id', authenticate, async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.userId;
        
        // First find the recipe to check ownership
        const recipe = await Recipe.findById(recipeId);
        
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        
        // Check if the current user is the owner of the recipe
        if (recipe.user.toString() !== userId) {
            return res.status(403).json({ message: "You don't have permission to delete this recipe" });
        }
        
        // If owner, proceed with deletion
        const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (err) {
        console.error("Error deleting recipe:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Save a recipe (Protected Route)
app.post('/save-recipe/:id', authenticate, async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.userId;
        
        // Check if recipe exists
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        
        // Check if already saved
        const existingSave = await Saved.findOne({ user: userId, recipe: recipeId });
        if (existingSave) {
            return res.status(400).json({ message: "Recipe already saved" });
        }
        
        // Create new saved record
        const newSaved = new Saved({
            user: userId,
            recipe: recipeId
        });
        
        await newSaved.save();
        res.status(200).json({ message: "Recipe saved successfully" });
    } catch (err) {
        console.error("Error saving recipe:", err);
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: err.message 
        });
    }
});

// Fetch saved recipes for a user (Protected Route)
app.get('/saved-recipes', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Find all saved entries for this user
        const savedEntries = await Saved.find({ user: userId });
        
        // Extract just the recipe IDs
        const recipeIds = savedEntries.map(entry => entry.recipe);
        
        // Fetch the actual recipe objects
        const savedRecipes = await Recipe.find({ _id: { $in: recipeIds } });
        
        res.json(savedRecipes);
    } catch (err) {
        console.error("Error fetching saved recipes:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Remove a saved recipe (Protected Route)
app.delete('/remove-saved-recipe/:id', authenticate, async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.userId;
        
        // Find and delete the saved entry
        const result = await Saved.findOneAndDelete({ user: userId, recipe: recipeId });
        
        if (!result) {
            return res.status(404).json({ message: "Saved recipe not found" });
        }
        
        res.status(200).json({ message: "Recipe removed from saved list" });
    } catch (err) {
        console.error("Error removing saved recipe:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});