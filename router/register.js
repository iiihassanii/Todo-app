const User = require('../model/userModel.js')
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const register = express.Router();


register.post('/', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        // Check if email is registered before
        const email = await User.findOne({ email: req.body.email });
        if (email) return res.status(400).json({ status: "error", message: "This email is already registered" });


        // Make hashed password
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const newUser = new User(req.body);
        await newUser.save();

        // Generate Token
        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.SECRET_KEY || "secret", { expiresIn: "1d" });
        res.cookie('token', token, { httpOnly: true, secure: true });

        res.status(201).json({ status: "success", message: "User registered successfully", username: username, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: 'Server Error......' });
    }
});

module.exports = register;