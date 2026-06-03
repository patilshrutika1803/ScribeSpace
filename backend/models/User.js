/**
 * backend/models/User.js
 * ------------------------------------------------------------
 * User schema for authentication.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      // bcryptjs hash string
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },


    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    verificationExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);

