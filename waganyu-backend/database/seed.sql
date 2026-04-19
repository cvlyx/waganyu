-- Insert sample users for testing
INSERT INTO users (name, email, password_hash, intent, profile_complete, city, location, rating, verified) VALUES 
('John Banda', 'john@example.com', '$2a$10$example_hash', 'hire', TRUE, 'Lilongwe', 'Lilongwe, Malawi', 4.8, TRUE),
('Mary Phiri', 'mary@example.com', '$2a$10$example_hash', 'find_work', TRUE, 'Blantyre', 'Blantyre, Malawi', 4.9, TRUE),
('Samuel Chikapa', 'samuel@example.com', '$2a$10$example_hash', 'both', TRUE, 'Mzuzu', 'Mzuzu, Malawi', 4.6, TRUE);

-- Insert sample jobs
INSERT INTO jobs (title, description, category, budget, budget_type, location, city, urgent, poster_id) VALUES 
('Kitchen Renovation', 'Need experienced carpenter for kitchen cabinet installation', 'Carpentry', 85000.00, 'fixed', 'Lilongwe', 'Lilongwe', FALSE, 1),
('Emergency Plumbing Repair', 'Burst pipe needs immediate repair', 'Plumbing', 45000.00, 'fixed', 'Blantyre', 'Blantyre', TRUE, 2),
('House Cleaning Service', 'Deep cleaning for 3-bedroom house', 'Cleaning', 25000.00, 'fixed', 'Mzuzu', 'Mzuzu', FALSE, 2);
