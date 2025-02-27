// routes/student.js
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const Student = require('../models/Student');
const SkillProgress = require('../models/SkillProgress');
const Achievement = require('../models/Achievement');
const RoadmapProgress = require('../models/RoadmapProgress');
const { validateObjectId } = require('../utils/validation');

/**
 * @route    GET /api/student/dashboard
 * @desc     Get student dashboard data including skills, achievements, and progress
 * @access   Private
 */
router.get('/dashboard', authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get student profile with populated skills and achievements
    const student = await Student.findById(studentId)
      .select('-password')
      .populate('skills')
      .lean();
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get skill progress metrics
    const skillProgress = await SkillProgress.find({ student: studentId })
      .populate('skill')
      .sort({ updatedAt: -1 })
      .lean();
    
    // Get achievements with completion status
    const achievements = await Achievement.find()
      .lean()
      .exec();
    
    const studentAchievements = await Achievement.find({ 
      'completedBy': { $elemMatch: { student: studentId } } 
    }).lean();
    
    const completedAchievementIds = studentAchievements.map(ach => ach._id.toString());
    
    const achievementsWithStatus = achievements.map(achievement => ({
      ...achievement,
      completed: completedAchievementIds.includes(achievement._id.toString()),
      progress: calculateAchievementProgress(achievement, student, skillProgress)
    }));
    
    // Get active roadmaps and their progress
    const roadmapProgress = await RoadmapProgress.find({ student: studentId })
      .populate({
        path: 'roadmap',
        populate: {
          path: 'skills'
        }
      })
      .lean();
    
    // Calculate gamification metrics
    const gamificationStats = {
      level: student.level || 1,
      experience: student.experience || 0,
      experienceToNextLevel: calculateExpToNextLevel(student.level || 1),
      streak: student.streak || 0,
      lastActive: student.lastActive,
      rank: await calculateStudentRank(studentId),
      points: student.points || 0
    };
    
    // Calculate skill mastery statistics
    const skillStats = calculateSkillStatistics(skillProgress);
    
    return res.json({
      student: {
        name: student.name,
        email: student.email,
        avatar: student.avatar,
        joinDate: student.createdAt
      },
      gamification: gamificationStats,
      skillStats,
      achievements: achievementsWithStatus,
      roadmapProgress,
      recentActivity: student.recentActivity || []
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route    GET /api/student/leaderboard
 * @desc     Get student leaderboard
 * @access   Private
 */
router.get('/leaderboard', authenticateJWT, async (req, res) => {
  try {
    const leaderboard = await Student.find()
      .select('name avatar level experience points streak badges')
      .sort({ points: -1, level: -1 })
      .limit(10)
      .lean();
    
    return res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route    POST /api/student/skill-progress/:skillId
 * @desc     Update skill progress for a student
 * @access   Private
 */
router.post('/skill-progress/:skillId', authenticateJWT, validateObjectId('skillId'), async (req, res) => {
  try {
    const { skillId } = req.params;
    const { progress, completedResources } = req.body;
    const studentId = req.user.id;
    
    // Validate progress percentage
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }
    
    // Find or create skill progress record
    let skillProgress = await SkillProgress.findOne({ 
      student: studentId, 
      skill: skillId 
    });
    
    const wasCompleted = skillProgress?.completed || false;
    const isNowCompleted = progress === 100;
    
    if (!skillProgress) {
      skillProgress = new SkillProgress({
        student: studentId,
        skill: skillId,
        progress: 0,
        completedResources: []
      });
    }
    
    // Calculate experience points to award
    const pointsToAward = calculateProgressPoints(
      skillProgress.progress, 
      progress, 
      completedResources,
      skillProgress.completedResources
    );
    
    // Update skill progress
    skillProgress.progress = progress;
    skillProgress.completed = isNowCompleted;
    
    // Add any new completed resources
    if (completedResources && completedResources.length > 0) {
      // Only add resources that aren't already in the array
      const newResources = completedResources.filter(
        resource => !skillProgress.completedResources.includes(resource)
      );
      skillProgress.completedResources = [...skillProgress.completedResources, ...newResources];
    }
    
    await skillProgress.save();
    
    // Update student points and experience
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    student.points = (student.points || 0) + pointsToAward;
    student.experience = (student.experience || 0) + pointsToAward;
    
    // Check for level up
    const currentLevel = student.level || 1;
    const expToNextLevel = calculateExpToNextLevel(currentLevel);
    
    if (student.experience >= expToNextLevel) {
      student.level = currentLevel + 1;
      
      // Add level up to recent activity
      student.recentActivity = student.recentActivity || [];
      student.recentActivity.unshift({
        type: 'LEVEL_UP',
        data: { newLevel: student.level },
        timestamp: new Date()
      });
      
      // Keep only the 20 most recent activities
      if (student.recentActivity.length > 20) {
        student.recentActivity = student.recentActivity.slice(0, 20);
      }
    }
    
    // Only update activity if it's a new day
    const lastActiveDate = student.lastActive ? new Date(student.lastActive).toDateString() : null;
    const todayDate = new Date().toDateString();
    
    if (lastActiveDate !== todayDate) {
      student.streak = (student.streak || 0) + 1;
      student.lastActive = new Date();
    }
    
    // Check if student has now completed a skill
    if (!wasCompleted && isNowCompleted) {
      // Add to recent activity
      student.recentActivity = student.recentActivity || [];
      student.recentActivity.unshift({
        type: 'SKILL_COMPLETED',
        data: { skillId },
        timestamp: new Date()
      });
      
      // Keep only the 20 most recent activities
      if (student.recentActivity.length > 20) {
        student.recentActivity = student.recentActivity.slice(0, 20);
      }
      
      // Check for achievements that might be unlocked
      await checkAndUpdateAchievements(studentId);
    }
    
    await student.save();
    
    return res.json({ 
      skillProgress,
      pointsAwarded: pointsToAward,
      newTotalPoints: student.points,
      levelUp: currentLevel !== student.level,
      newLevel: student.level
    });
    
  } catch (error) {
    console.error('Skill progress error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route    GET /api/student/achievements
 * @desc     Get all achievements for a student with completion status
 * @access   Private
 */
router.get('/achievements', authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get all achievements
    const achievements = await Achievement.find().lean();
    
    // Get student completed achievements
    const student = await Student.findById(studentId)
      .populate('achievements')
      .select('achievements')
      .lean();
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const completedAchievementIds = student.achievements 
      ? student.achievements.map(a => a._id.toString()) 
      : [];
    
    // Add completion status to each achievement
    const achievementsWithStatus = achievements.map(achievement => ({
      ...achievement,
      completed: completedAchievementIds.includes(achievement._id.toString())
    }));
    
    return res.json(achievementsWithStatus);
    
  } catch (error) {
    console.error('Achievements error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Helper functions
const calculateExpToNextLevel = (currentLevel) => {
  // Simple formula: 100 * level^1.5
  return Math.floor(100 * Math.pow(currentLevel, 1.5));
};

const calculateProgressPoints = (oldProgress, newProgress, newCompletedResources, oldCompletedResources) => {
  // Points for progress percentage increase
  const progressPoints = Math.max(0, newProgress - oldProgress);
  
  // Points for each newly completed resource (10 points each)
  const resourceCount = newCompletedResources 
    ? newCompletedResources.filter(r => !oldCompletedResources.includes(r)).length 
    : 0;
  const resourcePoints = resourceCount * 10;
  
  // Bonus for 100% completion (50 points)
  const completionBonus = (oldProgress < 100 && newProgress === 100) ? 50 : 0;
  
  return progressPoints + resourcePoints + completionBonus;
};

const calculateStudentRank = async (studentId) => {
  // Find students with higher points
  const higherRanked = await Student.countDocuments({
    points: { $gt: (await Student.findById(studentId).select('points')).points }
  });
  
  // Rank is position + 1 (1-based index)
  return higherRanked + 1;
};

const calculateAchievementProgress = (achievement, student, skillProgress) => {
  // Different calculation based on achievement type
  switch (achievement.type) {
    case 'SKILLS_COUNT':
      const completedSkillsCount = skillProgress.filter(sp => sp.completed).length;
      return Math.min(100, (completedSkillsCount / achievement.threshold) * 100);
    
    case 'STREAK':
      return Math.min(100, ((student.streak || 0) / achievement.threshold) * 100);
    
    case 'LEVEL':
      return Math.min(100, ((student.level || 1) / achievement.threshold) * 100);
    
    case 'POINTS':
      return Math.min(100, ((student.points || 0) / achievement.threshold) * 100);
    
    default:
      return 0;
  }
};

const calculateSkillStatistics = (skillProgress) => {
  const totalSkills = skillProgress.length;
  const completedSkills = skillProgress.filter(sp => sp.completed).length;
  const inProgressSkills = skillProgress.filter(sp => sp.progress > 0 && !sp.completed).length;
  const untouchedSkills = totalSkills - completedSkills - inProgressSkills;
  
  // Calculate average progress across all skills
  const totalProgress = skillProgress.reduce((sum, sp) => sum + sp.progress, 0);
  const averageProgress = totalSkills > 0 ? totalProgress / totalSkills : 0;
  
  return {
    totalSkills,
    completedSkills,
    inProgressSkills,
    untouchedSkills,
    averageProgress,
    completionRate: totalSkills > 0 ? (completedSkills / totalSkills) * 100 : 0
  };
};

const checkAndUpdateAchievements = async (studentId) => {
  // Get student data
  const student = await Student.findById(studentId).lean();
  
  // Get skill progress data
  const skillProgress = await SkillProgress.find({ 
    student: studentId 
  }).lean();
  
  // Get all achievements
  const achievements = await Achievement.find().lean();
  
  // Check each achievement to see if it should be unlocked
  for (const achievement of achievements) {
    const alreadyCompleted = await Achievement.findOne({
      _id: achievement._id,
      'completedBy.student': studentId
    });
    
    if (alreadyCompleted) continue;
    
    let completed = false;
    
    switch (achievement.type) {
      case 'SKILLS_COUNT':
        const completedSkillsCount = skillProgress.filter(sp => sp.completed).length;
        completed = completedSkillsCount >= achievement.threshold;
        break;
      
      case 'STREAK':
        completed = (student.streak || 0) >= achievement.threshold;
        break;
      
      case 'LEVEL':
        completed = (student.level || 1) >= achievement.threshold;
        break;
      
      case 'POINTS':
        completed = (student.points || 0) >= achievement.threshold;
        break;
      
      // Add more achievement types as needed
      default:
        completed = false;
    }
    
    if (completed) {
      // Update achievement with completion
      await Achievement.findByIdAndUpdate(achievement._id, {
        $push: {
          completedBy: {
            student: studentId,
            completedAt: new Date()
          }
        }
      });
      
      // Add achievement to student
      await Student.findByIdAndUpdate(studentId, {
        $push: { 
          achievements: achievement._id,
          recentActivity: {
            type: 'ACHIEVEMENT_UNLOCKED',
            data: { achievementId: achievement._id },
            timestamp: new Date()
          }
        }
      });
      
      // Award points for achievement
      await Student.findByIdAndUpdate(studentId, {
        $inc: { points: achievement.pointsAwarded || 50 }
      });
    }
  }
};

module.exports = router;