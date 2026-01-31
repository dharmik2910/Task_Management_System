const Project = require('../models/Project');
const Task = require('../models/Task');
const mongoose = require('mongoose');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalProjects = await Project.countDocuments({ user: userId });
        const totalTasks = await Task.countDocuments({ user: userId });



        // Fix for aggregate if needed or just simple count
        // Using simple counts for reliability if aggregate fails on some mongo versions without proper objectID casting
        const todoTasks = await Task.countDocuments({ user: userId, status: 'Todo' });
        const inProgressTasks = await Task.countDocuments({ user: userId, status: 'In Progress' });
        const doneTasks = await Task.countDocuments({ user: userId, status: 'Done' });

        const highPriorityTasks = await Task.countDocuments({ user: userId, priority: 'High' });
        const mediumPriorityTasks = await Task.countDocuments({ user: userId, priority: 'Medium' });
        const lowPriorityTasks = await Task.countDocuments({ user: userId, priority: 'Low' });

        const recentProjects = await Project.find({ user: userId }).sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            counts: {
                projects: totalProjects,
                tasks: totalTasks,
                tasksByStatus: {
                    todo: todoTasks,
                    inProgress: inProgressTasks,
                    done: doneTasks
                },
                tasksByPriority: {
                    high: highPriorityTasks,
                    medium: mediumPriorityTasks,
                    low: lowPriorityTasks
                }
            },
            recentProjects
        });
    } catch (error) {
        // Fallback if aggregation fails
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
