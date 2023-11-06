const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: Number },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true })

const tokenSchema = new mongoose.Schema({
    userId: { type: String },
    token: { type: String },
    refreshToken: { type: String },
    active: { type: Number },
    expireIn: { type: Number }
})
const User = mongoose.model('User', userSchema);
const UserToken = mongoose.model('UserToken', tokenSchema);

module.exports = { User, UserToken }
