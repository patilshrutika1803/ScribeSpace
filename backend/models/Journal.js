/**
 * backend/models/Journal.js
 * ------------------------------------------------------------
 * Journal entries schema.
 */

const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
  {
    user: {
      // Owner of the journal entry
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    mood: {
      type: String,
      required: false,
      trim: true,
      maxlength: 50,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Journal', journalSchema);

