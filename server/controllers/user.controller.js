const { validationResult } = require("express-validator")
const userService = require('../services/user.service');
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const firstError = error.array()[0];
        return res.status(400).json({ error: `${firstError.path}: ${firstError.msg}` });
    }
    const { name, email, password } = req.body
    try {
        const hashPwd = await userModel.hashPassword(password);
        const user = await userService.signup(name, email, hashPwd);
        const token = user.getToken();
        res.status(200).json({ token, user })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
const login = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            const firstError = error.array()[0];
            return res.status(400).json({ error: `${firstError.path}: ${firstError.msg}` });
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) throw new Error("User not found");

        const pwdMatch = await user.comparePassword(password);
        if (!pwdMatch) throw new Error("Invalid Credentials");

        const token = user.getToken();
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}
const validateToken = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id);
        if (!user) throw new Error("User not found");
        res.status(200).json({ user })
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}
const updateSocketID = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id);
        if (!user) throw new Error("User not found");
        user.socketID = req.query.socketID;
        user.save();
        res.status(200).json({ user })
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
}
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        res.status(200).json({ user });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}
const getUserScore = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        if (!user) throw new Error("User not found");
        res.status(200).json({ score: user.score });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}
module.exports = {
    signup,
    login,
    validateToken,
    updateSocketID,
    getUserById,
    getUserScore
}