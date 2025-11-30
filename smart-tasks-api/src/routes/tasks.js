// src/routes/tasks.js
const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Helper: get userId (for now fixed / from env)
const getUserId = () => process.env.DEFAULT_USER_ID || 'default';

// Create task
router.post('/', async (req, res) => {
  try {
    const userId = getUserId();

    const {
      title,
      description,
      dueDate,
      reminderAt,
      priority,
      tags,
      status
    } = req.body;

    const task = await Task.create({
      userId,
      title,
      description,
      dueDate,
      reminderAt,
      priority,
      tags,
      status
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Get all tasks (optionally filtered by status, tag, priority, etc.)
router.get('/', async (req, res) => {
  try {
    const userId = getUserId();
    const { status, priority, tag } = req.query;

    const query = { userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tag) query.tags = tag;

    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error('Error getting tasks:', err);
    res.status(500).json({ message: 'Error getting tasks' });
  }
});

// Quick filter: today's tasks
router.get('/filters/today', async (req, res) => {
  try {
    const userId = getUserId();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId,
      dueDate: { $gte: start, $lte: end }
    }).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    console.error('Error getting today tasks:', err);
    res.status(500).json({ message: 'Error getting today tasks' });
  }
});

// Quick filter: overdue
router.get('/filters/overdue', async (req, res) => {
  try {
    const userId = getUserId();
    const now = new Date();

    const tasks = await Task.find({
      userId,
      dueDate: { $lt: now },
      status: 'pending'
    }).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    console.error('Error getting overdue tasks:', err);
    res.status(500).json({ message: 'Error getting overdue tasks' });
  }
});

// Quick filter: upcoming next 7 days
router.get('/filters/upcoming', async (req, res) => {
  try {
    const userId = getUserId();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId,
      dueDate: { $gte: start, $lte: end },
      status: 'pending'
    }).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    console.error('Error getting upcoming tasks:', err);
    res.status(500).json({ message: 'Error getting upcoming tasks' });
  }
});

// Get task by id
router.get('/:id', async (req, res) => {
  try {
    const userId = getUserId();
    const task = await Task.findOne({ _id: req.params.id, userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error('Error getting task:', err);
    res.status(500).json({ message: 'Error getting task' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const userId = getUserId();
    const update = req.body;

    // If reminderAt changed, reset reminderSent
    if (update.reminderAt) {
      update.reminderSent = false;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      update,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserId();
    const result = await Task.deleteOne({ _id: req.params.id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
