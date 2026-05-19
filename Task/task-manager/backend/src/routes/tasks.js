const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All task routes are protected
router.use(protect);

/**
 * GET /tasks
 * Returns all tasks belonging to the authenticated user.
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('GET /tasks error:', error.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * POST /tasks
 * Creates a new task for the authenticated user.
 */
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' });
  }

  try {
    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      status: 'Planned',
      userId: req.user.uid,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('POST /tasks error:', error.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

/**
 * PATCH /tasks/:id
 * Updates the status of a task. User must own the task.
 */
router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Planned', 'In Progress', 'Complete'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid }, // ownership check
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('PATCH /tasks/:id error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    res.status(500).json({ error: 'Failed to update task' });
  }
});

module.exports = router;
