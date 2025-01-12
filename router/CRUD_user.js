const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel.js')
const userRouter = express.Router();


userRouter.get('/user', async(req ,res )=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');    
        if (!user) return res.status(404).json({ status: "error", message: 'User not found' });
        return res.status(200).json({ status: "success", user: user });
        
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
    }
    
});

userRouter.put('/user', async (req, res) => {
    const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); // Exclude the password from the response
        if (!user) return res.status(404).json({ status: "error", message: 'User not found' });

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    try {
        const userUpdate = await User.findByIdAndUpdate(userId, req.body, { new: true }).select('-password');
        if (!userUpdate) {
            return res.status(404).json({ status: "error", message: "Failed to update user information" });
        }
        res.status(200).json({ status: "success", message: "User information updated successfully", user: userUpdate });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
    }
});  

userRouter.delete('/user', async (req, res) => {
    try {
        const userId = req.user.id;
            const user = await User.findById(userId).select('-password'); // Exclude the password from the response
            if (!user) return res.status(404).json({ status: "error", message: 'User not found' });

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        await User.findByIdAndDelete(userId); // Delete the user
        return res.status(200).json({ status: "success", message: "User account deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
    }
}); 

module.exports = userRouter;
