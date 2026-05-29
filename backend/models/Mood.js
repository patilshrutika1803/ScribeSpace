/**
 * backend/models/Mood.js
 * ------------------------------------------------------------
 * Mood logs schema.
 */

const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    mood: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    note: {
      type: String,
      required: false,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Mood', moodSchema);

