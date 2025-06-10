const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    socketId: { type: String },
    score: { type: Number, default: 0 },
});
userSchema.methods.getToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    })
}
userSchema.statics.hashPassword =async function (password) {
    return await bcrypt.hash(password, 10);
}
userSchema.methods.comparePassword =async function (password) {
    return await bcrypt.compare(password, this.password);
}
module.exports = mongoose.model('User', userSchema)