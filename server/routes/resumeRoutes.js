const express = require('express');
const resumeController = require('../controller/resumeController');

const router = express.Router();

// Route to parse resume
router.post('/parse', (req, res, next) => {
  const upload = req.app.locals.upload;
  
  upload.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file' });
    }
    
    next();
  });
}, resumeController.parseResume);

module.exports = router;