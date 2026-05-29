/**
 * backend/models/FocusSession.js
 * ------------------------------------------------------------
 * Focus sessions schema.
 */

const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    mode: {
      // e.g. Deep Work, Study, Meditation, etc.
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Store duration in minutes (frontend uses durations in minutes)
    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    completed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('FocusSession', focusSessionSchema);

