Authentication Pages
Login (/(auth)/login) - User sign-in
Register (/(auth)/register) - New user signup
Setup (/(auth)/setup) - Profile setup for new users
Landing (/landing) - Welcome/marketing page for non-authenticated users


🏠 Main App Pages (Tab Navigation)
Home (/(tabs)/index) - Dashboard with jobs, workers, search functionality
Workers (/(tabs)/workers) - Browse and filter skilled workers
Messages (/(tabs)/messages) - In-app messaging with unread count badges
Notifications (/(tabs)/notifications) - Alerts and updates with unread count badges
Profile (/(tabs)/profile) - User profile management


📄 Detail Pages
Job Details (/job/[id]) - Individual job posting view
Worker Profile (/worker/[id]) - Individual worker profile view
Chat (/chat/[id]) - Direct messaging interface


🛠️ Utility Pages
Post Job (/post-job) - Create new job posting
Index (/index) - App entry point with routing logic
404 (/+not-found) - Not found page


🔄 Navigation Flow
New User: Landing → Login/Register → Setup → Main App
Returning User: Landing → Login → Main App
Authenticated User: Direct to Main App tabs


📊 Key Features Available
Job posting and browsing
Worker profiles with filtering
Real-time messaging
Push notifications
Search functionality
Category filtering (Plumbing, Electrical, Cleaning, Tutoring, Moving, Carpentry, Painting, Cooking)
User profile management
Location-based services


 ALL SYSTEM PAGES (IMPORTANT)
🔐 Auth Pages
Login

Register (choose role: client / worker / skilled)

OTP Verification

Forgot Password

🏠 General Pages
Home (job feed)

Search / Explore

Notifications

Messages (chat list)

Chat screen

👤 User Profile
View Profile

Edit Profile

Ratings & Reviews

💼 Job System
Post Job

Job Details

My Jobs (posted)

Applications List

Apply to Job

🧑‍🔧 Skilled Workers Directory (NEW FEATURE)
For Skilled Worker:
Create Professional Profile

Upload Certificates

Skills & Experience Form

Approval Status Page

For Clients:
Browse Skilled Workers

Filter (location, skill, rating)

Skilled Worker Profile View

🛠️ Admin Panel (WEB ONLY)
Dashboard

User Management

Skilled Worker Approvals

Reports / Complaints

Job Monitoring

💳 (Future Pages – Payments)
Wallet / Payments

Transaction History

⚠️ Important Architecture Tips
Keep backend separate → reusable for both web & mobile

Use REST API (or GraphQL later)

Centralize:

Auth

Validation

Error handling

✅ Error-Free / Clean Setup Tips
Use .env for configs (DB, API keys)

Use MVC structure in backend

Add:

Global error handler

Input validation (Joi / express-validator)

Use consistent naming across web & mobile