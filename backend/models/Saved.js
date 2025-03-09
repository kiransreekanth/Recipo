const mongoose = require('mongoose');

const SavedSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Saved', SavedSchema);
