const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['Planned', 'In Progress', 'Complete'],
      default: 'Planned',
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Task', taskSchema);
