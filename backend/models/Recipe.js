const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Associate recipe with a user
    title: { type: String, required: true },
    category: { type: String, enum: ['vegetarian', 'non-vegetarian'], required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
