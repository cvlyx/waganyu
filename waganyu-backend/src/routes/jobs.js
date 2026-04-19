const express = require('express');
const { body, validationResult, query } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create job
router.post('/', authMiddleware, [
  body('title').trim().isLength({ min: 5 }),
  body('description').trim().isLength({ min: 20 }),
  body('category').trim().isLength({ min: 2 }),
  body('budget').isNumeric(),
  body('budget_type').isIn(['fixed', 'hourly']),
  body('location').trim().isLength({ min: 2 }),
  body('city').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, budget, budget_type, location, city, urgent } = req.body;
    const posterId = req.userId;

    // Check if user can post jobs
    const [userResult] = await pool.execute(
      'SELECT intent FROM users WHERE id = ?',
      [posterId]
    );
    
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userIntent = userResult[0].intent;
    if (userIntent === 'find_work') {
      return res.status(403).json({ error: 'Access denied. Cannot post jobs.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO jobs (title, description, category, budget, budget_type, 
       location, city, urgent, poster_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, category, budget, budget_type, location, city, urgent || false, posterId]
    );

    res.status(201).json({
      message: 'Job created successfully',
      jobId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get jobs with filtering
router.get('/', authMiddleware, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().trim(),
  query('city').optional().trim(),
  query('max_distance').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim()
], async (req, res) => {
  try {
    const { page = 1, limit = 20, category, city, max_distance, search } = req.query;
    const userId = req.userId;
    const offset = (page - 1) * limit;

    // Get user location and intent for filtering
    const [userResult] = await pool.execute(
      'SELECT city, intent FROM users WHERE id = ?',
      [userId]
    );
    
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userCity = userResult[0].city;
    const userIntent = userResult[0].intent;

    // Check if user can view jobs
    if (userIntent === 'hire') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Build query
    let whereClause = 'WHERE j.status = "open"';
    let queryParams = [];

    // Add search filter
    if (search) {
      whereClause += ' AND (j.title LIKE ? OR j.description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Add category filter
    if (category) {
      whereClause += ' AND j.category = ?';
      queryParams.push(category);
    }

    // Add city filter
    if (city) {
      whereClause += ' AND j.city = ?';
      queryParams.push(city);
    }

    // Add distance filter (simplified - using city matching for now)
    if (max_distance && userCity) {
      whereClause += ' AND j.city = ?';
      queryParams.push(userCity);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM jobs j ${whereClause}`,
      queryParams
    );

    // Get jobs
    const [jobs] = await pool.execute(
      `SELECT j.*, u.name as poster_name, u.avatar as poster_avatar,
       (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = j.id) as applications_count
       FROM jobs j 
       JOIN users u ON j.poster_id = u.id 
       ${whereClause}
       ORDER BY j.posted_at DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply for job
router.post('/:id/apply', authMiddleware, [
  body('message').optional().trim().isLength({ min: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const jobId = req.params.id;
    const applicantId = req.userId;
    const { message } = req.body;

    // Check if user can apply for jobs
    const [userResult] = await pool.execute(
      'SELECT intent FROM users WHERE id = ?',
      [applicantId]
    );
    
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userIntent = userResult[0].intent;
    if (userIntent === 'hire') {
      return res.status(403).json({ error: 'Access denied. Cannot apply for jobs.' });
    }

    // Check if job exists and is open
    const [jobs] = await pool.execute(
      'SELECT * FROM jobs WHERE id = ? AND status = "open"',
      [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found or not open' });
    }

    // Check if already applied
    const [existing] = await pool.execute(
      'SELECT id FROM job_applications WHERE job_id = ? AND applicant_id = ?',
      [jobId, applicantId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    // Create application
    const [result] = await pool.execute(
      'INSERT INTO job_applications (job_id, applicant_id, message) VALUES (?, ?, ?)',
      [jobId, applicantId, message || '']
    );

    // Update applications count
    await pool.execute(
      'UPDATE jobs SET applications_count = applications_count + 1 WHERE id = ?',
      [jobId]
    );

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
