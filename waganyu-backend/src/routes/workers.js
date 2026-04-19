const express = require('express');
const { query } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get workers with filtering
router.get('/', authMiddleware, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('skill').optional().trim(),
  query('city').optional().trim(),
  query('max_distance').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('sort_by').optional().isIn(['rating', 'jobs_completed', 'hourly_rate'])
], async (req, res) => {
  try {
    const { page = 1, limit = 20, skill, city, max_distance, search, sort_by = 'rating' } = req.query;
    const userId = req.userId;
    const offset = (page - 1) * limit;

    // Get user location for distance filtering
    const [userResult] = await pool.execute(
      'SELECT city, intent FROM users WHERE id = ?',
      [userId]
    );
    
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userCity = userResult[0].city;
    const userIntent = userResult[0].intent;

    // Check if user can view workers (hire or both intent)
    if (userIntent === 'find_work') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Build query
    let whereClause = 'WHERE u.profile_complete = TRUE';
    let queryParams = [];
    let joinClause = '';

    // Add search filter
    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.bio LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Add skill filter
    if (skill) {
      joinClause += ' JOIN user_skills us ON u.id = us.user_id JOIN skills s ON us.skill_id = s.id';
      whereClause += ' AND s.name = ?';
      queryParams.push(skill);
    }

    // Add city filter
    if (city) {
      whereClause += ' AND u.city = ?';
      queryParams.push(city);
    }

    // Add distance filter (simplified - using city matching)
    if (max_distance && userCity) {
      whereClause += ' AND u.city = ?';
      queryParams.push(userCity);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(DISTINCT u.id) as total FROM users u ${joinClause} ${whereClause}`,
      queryParams
    );

    // Get workers with skills
    const [workers] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.avatar, u.rating, u.review_count, 
       u.verified, u.location, u.city, u.bio, u.joined_at,
       GROUP_CONCAT(s.name) as skills
       FROM users u 
       ${joinClause}
       LEFT JOIN user_skills us ON u.id = us.user_id 
       LEFT JOIN skills s ON us.skill_id = s.id 
       ${whereClause}
       GROUP BY u.id
       ORDER BY ${sort_by === 'rating' ? 'u.rating DESC' : 
                  sort_by === 'jobs_completed' ? 'u.review_count DESC' : 
                  'u.joined_at DESC'}
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    // Format skills array
    workers.forEach(worker => {
      worker.skills = worker.skills ? worker.skills.split(',') : [];
    });

    res.json({
      workers,
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

// Get worker profile
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const workerId = req.params.id;

    // Get worker details
    const [workers] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.avatar, u.rating, u.review_count, 
       u.verified, u.location, u.city, u.bio, u.joined_at, u.intent
       FROM users u WHERE u.id = ? AND u.profile_complete = TRUE`,
      [workerId]
    );

    if (workers.length === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const worker = workers[0];

    // Get worker skills
    const [skills] = await pool.execute(
      `SELECT s.name FROM skills s 
       JOIN user_skills us ON s.id = us.skill_id 
       WHERE us.user_id = ?`,
      [workerId]
    );

    worker.skills = skills.map(s => s.name);

    // Get reviews
    const [reviews] = await pool.execute(
      `SELECT r.rating, r.comment, r.created_at, 
       u.name as reviewer_name, u.avatar as reviewer_avatar
       FROM reviews r 
       JOIN users u ON r.reviewer_id = u.id 
       WHERE r.reviewee_id = ? 
       ORDER BY r.created_at DESC 
       LIMIT 10`,
      [workerId]
    );

    worker.reviews = reviews;

    res.json({ worker });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
