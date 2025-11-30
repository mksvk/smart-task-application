// src/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      default: 'default'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    dueDate: {
      type: Date
    },
    reminderAt: {
      type: Date
    },
    reminderSent: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'done'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Helpful compound index for reminder worker
TaskSchema.index({ reminderAt: 1, reminderSent: 1, userId: 1 });

module.exports = mongoose.model('Task', TaskSchema);
