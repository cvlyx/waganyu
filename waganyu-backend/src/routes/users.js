const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Complete profile setup
router.post('/complete-profile', authMiddleware, [
  body('intent').isIn(['hire', 'find_work', 'both']),
  body('city').trim().isLength({ min: 2 }),
  body('skills').isArray(),
  body('heardFrom').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { intent, city, skills, heardFrom, bio, emailVerified } = req.body;
    const userId = req.userId;

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update user profile
      await connection.execute(
        `UPDATE users SET intent = ?, city = ?, location = ?, heard_from = ?, 
         bio = ?, profile_complete = ?, email_verified = ? WHERE id = ?`,
        [intent, city, `${city}, Malawi`, heardFrom, bio || null, true, emailVerified || false, userId]
      );

      // Clear existing skills
      await connection.execute('DELETE FROM user_skills WHERE user_id = ?', [userId]);

      // Add new skills
      if (skills && skills.length > 0) {
        for (const skillName of skills) {
          // Get or create skill
          const [skillResult] = await connection.execute(
            'SELECT id FROM skills WHERE name = ?',
            [skillName]
          );
          
          let skillId;
          if (skillResult.length === 0) {
            const [insertResult] = await connection.execute(
              'INSERT INTO skills (name) VALUES (?)',
              [skillName]
            );
            skillId = insertResult.insertId;
          } else {
            skillId = skillResult[0].id;
          }

          // Link skill to user
          await connection.execute(
            'INSERT INTO user_skills (user_id, skill_id) VALUES (?, ?)',
            [userId, skillId]
          );
        }
      }

      await connection.commit();

      res.json({ message: 'Profile completed successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Get user details
    const [users] = await pool.execute(
      `SELECT id, name, email, role, intent, profile_complete, email_verified,
       avatar, rating, review_count, verified, location, city, bio, heard_from,
       joined_at FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Get user skills
    const [skills] = await pool.execute(
      `SELECT s.name FROM skills s 
       JOIN user_skills us ON s.id = us.skill_id 
       WHERE us.user_id = ?`,
      [userId]
    );

    user.skills = skills.map(s => s.name);

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, bio, avatar } = req.body;

    const [result] = await pool.execute(
      'UPDATE users SET name = ?, bio = ?, avatar = ? WHERE id = ?',
      [name, bio, avatar, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
