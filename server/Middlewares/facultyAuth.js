const jwt = require('jsonwebtoken');
const Faculty = require('../models/Faculty.models');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded token:', decoded);  
    
    const faculty = await Faculty.findOne({ 
      facultyId: decoded.facultyId
    });

    if (!faculty) {
      return res.status(401).json({ error: 'Faculty not found' });
    }
    
    req.faculty = faculty;  
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
