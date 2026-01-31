const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject, getProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProjects).post(protect, createProject);
router.route('/:id').get(protect, getProject).put(protect, updateProject).delete(protect, deleteProject);

module.exports = router;
