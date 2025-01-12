const express = require('express');
const User = require('../model/userModel.js')
const Task = require('../model/taskModel.js')
const Cat = require('../model/categoryModel.js')
const todoRouter = express.Router();

todoRouter.post('/task', async(req ,res )=>{
    try {
        const userId = req.user.id;
        const { title, description, status, due_date, category } = req.body;
        const user = await User.findById(userId).select('-password');    
        if (!user) return res.status(404).json({ status: "error", message: 'User not found' });
        
        let categoryId;
        if (category) {
            let cat = await Cat.findOne({ name: category });
        if (!cat) {
            cat = await Cat.create({ name: category });
        }
        categoryId = cat._id;
        }

        const taskData = {
            title,
            description,
            status,
            due_date: due_date ? new Date(due_date) : undefined,
            category: categoryId || category,
        }
        const newTask = await Task.create(taskData);
        
        user.tasks.push(newTask._id);
        await user.save();


        res.status(201).json({
        status: 'success',
        message: 'Task created and linked to user',
        data: newTask,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server Error" });
    }
});


todoRouter.put('/task', async (req, res) => {
    try {
        const userId = req.user.id; // Authenticated user ID
        const taskId = req.query.id; // Task ID from query parameter
        const { title, description, status, due_date, category } = req.body; // Task fields from request body

        // Find the user
        const user = await User.findById(userId).select('-password');    
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Validate the task ID
        if (!taskId) {
            return res.status(400).json({ status: 'error', message: 'Task ID not provided' });
        }

        // Locate the task within the user's tasks array
        const taskIndex = user.tasks.findIndex((task) => task._id.toString() === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Task not found in user\'s tasks' });
        }

        let categoryId;
        if (category) {
            let cat = await Cat.findOne({ name: category });
            if (!cat) {
                cat = await Cat.create({ name: category }); // Create new category if not found
            }
            categoryId = cat._id;
        }

        
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                title,
                description,
                status,
                due_date: due_date ? new Date(due_date) : undefined,
                category: categoryId || undefined,
            },
            { new: true } // Return the updated task
        );

        if (!updatedTask) {
            return res.status(404).json({ status: 'error', message: 'Task not found in database' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Task updated successfully',
            data: updatedTask,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error', error: error.message });
    }
});


todoRouter.get('/task', async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.query.id;

        const user = await User.findById(userId).populate({
        path: 'tasks',
        populate: {
            path: 'category',
            select: 'name -_id',
        },
        });

        if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        let tasks = user.tasks;
        if (taskId) {
            tasks = tasks.filter((task) => task._id.toString() === taskId);

            if (tasks.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Task not found in user\'s tasks',
                });
            }
        }

        res.status(200).json({
        status: 'success',
        message: 'Tasks fetched successfully',
        data: tasks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error', error: error.message });
    }
});


todoRouter.delete('/task/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        if (!taskId){
            return res.status(404).json({ status: 'error', message: 'Task ID not provided' });
        }
        
        const taskIndex = user.tasks.findIndex((task) => task._id.toString() === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Task not found in user\'s tasks' });
        }


        user.tasks.splice(taskIndex, 1); 
        await user.save();
        await Task.findByIdAndDelete(taskId);


        res.status(200).json({
        status: 'success',
        message: 'Task has been deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error', error: error.message });
    }
});




module.exports = todoRouter;
