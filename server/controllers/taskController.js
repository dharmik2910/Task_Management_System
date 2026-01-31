const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for current user
// @route   GET /api/tasks
// @access  Private
const getAllUserTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user.id }).populate('project', 'title');
    res.status(200).json(tasks);
};

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasks = async (req, res) => {
    const tasks = await Task.find({ project: req.params.projectId });
    res.status(200).json(tasks);
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const { title, description, projectId, priority, dueDate, assignedTo, status } = req.body;

    if (!title || !projectId) {
        res.status(400);
        throw new Error('Please add title and project ID');
    }

    // Verify project belongs to user
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    if (project.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized to add task to this project');
    }

    const task = await Task.create({
        title,
        description,
        project: projectId,
        priority,
        dueDate,
        assignedTo,
        status,
        user: req.user.id,
    });

    res.status(200).json(task);
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    // Check if user is owner of task (or maybe project owner, but for now user who created task)
    // Actually, in many systems, anyone in the project can update, but here we assume simple personal project management
    // or checks against project owner.
    // For simplicity, we check if the current user is the creator of the task OR the project owner.
    // We already stored 'user' in task as creator.

    if (task.user.toString() !== req.user.id) {
        const project = await Project.findById(task.project);
        if (project.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedTask);
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    if (task.user.toString() !== req.user.id) {
        const project = await Project.findById(task.project);
        if (project.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getAllUserTasks,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
