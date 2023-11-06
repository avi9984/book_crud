const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookId: { type: Number },
    title: { type: String, required: true, unique: true, trim: true },
    author: { type: String },
    summery: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Book', bookSchema);