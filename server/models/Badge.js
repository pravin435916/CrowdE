// models/Badge.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Skill', 'Participation', 'Milestone'],
    default: 'Skill'
  },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', BadgeSchema);