const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Programming Languages',
      'Frameworks & Libraries',
      'Databases',
      'DevOps',
      'Cloud Services',
      'Design',
      'Other'
    ]
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  resources: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String
    },
    type: {
      type: String,
      enum: ['Article', 'Video', 'Course', 'Book', 'Tutorial', 'Documentation'],
      default: 'Article'
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', SkillSchema);