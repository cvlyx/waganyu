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