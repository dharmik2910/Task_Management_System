const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, getAllUserTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllUserTasks);

router.post('/', protect, createTask);
router.get('/project/:projectId', protect, getTasks);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
