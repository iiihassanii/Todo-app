const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel.js')
const login = express.Router();
/**
 * @des Login user
 * @route /login
 * @method POST
 * @access public
 */
login.post('/', async (req, res) => {
    try {
        // Check if username is registered before
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).json({ status: "error", message: "Invalid username or password" });
        
        // Check if password is correct
        const isPassCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPassCorrect) return res.status(401).json({ status: "error", message: "Invalid username or password" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY || "secret", { expiresIn: "1d" });
        const { password, ...other } = user._doc;
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.status(200).json({ status: "success", message: "Login successful", user: other, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: 'Server Error......' });
    }
});


module.exports = login; // Directly export the router
