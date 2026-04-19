# Waganyu Backend

## Setup Instructions

### 1. Database Setup
```bash
# Start MySQL server
# Run database schema
mysql -u root -p < database/schema.sql

# Optional: Run seed data
mysql -u root -p < database/seed.sql
```

### 2. Environment Configuration
```bash
# Copy and edit .env file
cp .env.example .env
# Update with your database credentials and JWT secret
```

### 3. Start Development Server
```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### 4. Test API
```bash
# Run tests
npm test

# Test specific endpoints
curl -X GET http://localhost:5000/api/health
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Users
- `POST /api/users/complete-profile` - Complete user profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs` - Get jobs with filtering
- `POST /api/jobs/:id/apply` - Apply for job

### Workers
- `GET /api/workers` - Get workers with filtering
- `GET /api/workers/:id` - Get worker profile

## Role-Based Access Control

- **Hire Intent**: Can post jobs, browse workers
- **Find Work Intent**: Can browse jobs, apply for work
- **Both Intent**: Full access to both jobs and workers

## Next Steps

1. ✅ Project structure created
2. ✅ Database schema created
3. ✅ Authentication system implemented
4. ✅ Basic API endpoints created
5. 🔄 Database setup needed
6. ⏳ API testing
7. ⏳ Frontend integration
