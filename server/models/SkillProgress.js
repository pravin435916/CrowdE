const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkillProgressSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  skill: {
    type: Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  completedResources: [{
    type: String // Resource IDs or names
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index to ensure a student can have only one progress record per skill
SkillProgressSchema.index({ student: 1, skill: 1 }, { unique: true });