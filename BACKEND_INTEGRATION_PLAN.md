# Waganyu Backend Integration Plan

## Overview
This document outlines the complete integration plan for creating a unified Node.js + MySQL backend that will serve both the web and mobile Waganyu applications.

## Architecture Overview

```
waganyu-backend/
|-- src/
|   |-- controllers/          # API controllers
|   |-- middleware/           # Authentication, validation, etc.
|   |-- models/              # Database models
|   |-- routes/              # API routes
|   |-- services/            # Business logic
|   |-- utils/               # Helper functions
|   |-- config/              # Configuration files
|   |-- database/            # Database connection and migrations
|-- tests/                  # Test files
|-- docs/                   # API documentation
|-- package.json
|-- .env.example
|-- server.js
```

## Phase 1: Project Setup & Database Design

### 1.1 Initialize Backend Project

```bash
# Create backend directory
mkdir waganyu-backend
cd waganyu-backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express mysql2 cors helmet morgan dotenv bcryptjs jsonwebtoken
npm install express-rate-limit express-validator multer nodemailer
npm install swagger-jsdoc swagger-ui

# Install development dependencies
npm install -D nodemon jest supertest eslint prettier
npm install -D @types/node @types/express @types/bcryptjs @types/jsonwebtoken

# Create project structure
mkdir -p src/{controllers,middleware,models,routes,services,utils,config,database}
mkdir -p tests docs
```

### 1.2 Package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "migrate": "node src/database/migrate.js",
    "seed": "node src/database/seed.js",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

### 1.3 MySQL Database Schema

```sql
-- Create database
CREATE DATABASE waganyu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE waganyu_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    intent ENUM('hire', 'find_work', 'both') NOT NULL,
    profile_complete BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    avatar VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    city VARCHAR(100),
    bio TEXT,
    heard_from VARCHAR(100),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_intent (intent),
    INDEX idx_city (city)
);

-- Skills table
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User skills junction table
CREATE TABLE user_skills (
    user_id INT,
    skill_id INT,
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Jobs table
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    budget_type ENUM('fixed', 'hourly') DEFAULT 'fixed',
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    urgent BOOLEAN DEFAULT FALSE,
    status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
    poster_id INT NOT NULL,
    applications_count INT DEFAULT 0,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (poster_id) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_city (city),
    INDEX idx_poster (poster_id)
);

-- Job applications table
CREATE TABLE job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    applicant_id INT NOT NULL,
    message TEXT,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, applicant_id),
    INDEX idx_job (job_id),
    INDEX idx_applicant (applicant_id)
);

-- Reviews table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    job_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (reviewee_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    UNIQUE KEY unique_review (reviewer_id, reviewee_id, job_id),
    INDEX idx_reviewee (reviewee_id),
    INDEX idx_job (job_id)
);

-- Messages table
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    job_id INT,
    content TEXT NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    INDEX idx_conversation (sender_id, receiver_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_job (job_id)
);

-- OTP verification table
CREATE TABLE otp_verification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_email (email),
    INDEX idx_otp (otp_code)
);

-- Insert initial skills
INSERT INTO skills (name) VALUES 
('Plumbing'), ('Electrical'), ('Cleaning'), ('Carpentry'), ('Painting'),
('Moving'), ('Tutoring'), ('Cooking'), ('Gardening'), ('IT Support'),
('Driving'), ('Security'), ('Photography'), ('Tailoring'), ('Masonry');
```

### 1.4 Environment Configuration

```bash
# Create .env file
cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=waganyu_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
EOF
```

## Phase 2: Core Backend Implementation

### 2.1 Database Connection Setup

```bash
# Create database configuration
cat > src/config/database.js << 'EOF'
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'waganyu_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

module.exports = pool;
EOF
```

### 2.2 Server Setup

```bash
# Create main server file
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const jobRoutes = require('./src/routes/jobs');
const workerRoutes = require('./src/routes/workers');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX),
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// General middleware
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/workers', workerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF
```

### 2.3 Authentication Module

```bash
# Create authentication routes
cat > src/routes/auth.js << 'EOF'
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    
    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    
    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, intent, profile_complete FROM users WHERE id = ?',
      [req.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
EOF
```

### 2.4 Authentication Middleware

```bash
# Create auth middleware
cat > src/middleware/auth.js << 'EOF'
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
EOF
```

## Phase 3: User Management & Profile APIs

### 3.1 User Routes

```bash
# Create user routes
cat > src/routes/users.js << 'EOF'
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
EOF
```

## Phase 4: Job Management APIs

### 4.1 Job Routes

```bash
# Create job routes
cat > src/routes/jobs.js << 'EOF'
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
EOF
```

## Phase 5: Worker/Service Provider APIs

### 5.1 Worker Routes

```bash
# Create worker routes
cat > src/routes/workers.js << 'EOF'
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
EOF
```

## Phase 6: Frontend Integration

### 6.1 Web Frontend Updates

```bash
# Create API service for web
cat > waganyu-web/src/services/api.js << 'EOF'
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('waganyu_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('waganyu_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('waganyu_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(data.token);
    return data;
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // User endpoints
  async completeProfile(profileData) {
    return this.request('/users/complete-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Job endpoints
  async getJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/jobs?${queryString}`);
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async applyForJob(jobId, message) {
    return this.request(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Worker endpoints
  async getWorkers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/workers?${queryString}`);
  }

  async getWorker(workerId) {
    return this.request(`/workers/${workerId}`);
  }
}

export default new ApiService();
EOF
```

### 6.2 Mobile Frontend Updates

```bash
# Create API service for mobile
cat > Task-Connect-Hub/artifacts/waganyu-mobile/services/api.js << 'EOF'
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(data.token);
    return data;
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // User endpoints
  async completeProfile(profileData) {
    return this.request('/users/complete-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Job endpoints
  async getJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/jobs?${queryString}`);
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async applyForJob(jobId, message) {
    return this.request(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Worker endpoints
  async getWorkers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/workers?${queryString}`);
  }

  async getWorker(workerId) {
    return this.request(`/workers/${workerId}`);
  }
}

export default new ApiService();
EOF
```

## Phase 7: Testing & Deployment

### 7.1 Testing Setup

```bash
# Create test setup
cat > tests/setup.js << 'EOF'
const request = require('supertest');
const app = require('../server');

global.request = request(app);
EOF
```

### 7.2 Sample Test

```bash
# Create auth test
cat > tests/auth.test.js << 'EOF'
const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
  test('POST /api/auth/register', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  test('POST /api/auth/login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
EOF
```

### 7.3 Deployment Commands

```bash
# Production setup
npm install pm2 -g

# Create ecosystem file for PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'waganyu-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start production server
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

## Implementation Commands

### Phase 1 Commands
```bash
# Create and setup backend project
mkdir waganyu-backend && cd waganyu-backend
npm init -y
npm install express mysql2 cors helmet morgan dotenv bcryptjs jsonwebtoken express-rate-limit express-validator multer nodemailer swagger-jsdoc swagger-ui
npm install -D nodemon jest supertest eslint prettier @types/node @types/express @types/bcryptjs @types/jsonwebtoken

# Create directory structure
mkdir -p src/{controllers,middleware,models,routes,services,utils,config,database}
mkdir -p tests docs

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### Phase 2 Commands
```bash
# Start development server
npm run dev

# Run tests
npm test

# Run with specific test file
npm test -- tests/auth.test.js
```

### Phase 3 Commands
```bash
# Database migration
npm run migrate

# Seed database
npm run seed

# Lint code
npm run lint
npm run lint:fix
```

### Phase 4 Commands
```bash
# Production deployment
npm run build
pm2 start ecosystem.config.js
pm2 logs
pm2 monit
```

## Next Steps & Timeline

### Week 1: Backend Foundation
- [ ] Set up Node.js project structure
- [ ] Create MySQL database schema
- [ ] Implement authentication system
- [ ] Set up basic API endpoints

### Week 2: Core Features
- [ ] User management APIs
- [ ] Job posting and management
- [ ] Worker/service provider APIs
- [ ] Location-based filtering

### Week 3: Advanced Features
- [ ] Messaging system
- [ ] Review and rating system
- [ ] File upload functionality
- [ ] Email verification (OTP)

### Week 4: Integration & Testing
- [ ] Update web frontend to use new backend
- [ ] Update mobile frontend to use new backend
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Documentation

### Week 5: Deployment & Monitoring
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Backup strategies
- [ ] Security hardening

## Success Metrics

1. **API Performance**: Response time < 200ms for 95% of requests
2. **Database Performance**: Query optimization for large datasets
3. **Security**: Zero vulnerabilities in security audit
4. **Scalability**: Handle 1000+ concurrent users
5. **Reliability**: 99.9% uptime

## Monitoring & Maintenance

- **Application Monitoring**: Use PM2 monitoring
- **Database Monitoring**: MySQL slow query log
- **Error Tracking**: Implement error logging
- **Performance Metrics**: Response time tracking
- **Backup Strategy**: Daily database backups

This comprehensive plan provides a complete roadmap for creating a unified backend that will serve both web and mobile applications with proper authentication, role-based access control, location-based filtering, and all the features currently implemented in the frontend applications.
