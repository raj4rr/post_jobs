USE referral_jobs;

INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@refjobs.com', '$2a$10$hzNE/gexoDiqNGdCGJfLC.ngicj6.8FJOo034WubsFgwJilNTw6tO', 'admin'),
('Poster One', 'poster@refjobs.com', '$2a$10$hzNE/gexoDiqNGdCGJfLC.ngicj6.8FJOo034WubsFgwJilNTw6tO', 'job_poster'),
('Seeker One', 'seeker@refjobs.com', '$2a$10$hzNE/gexoDiqNGdCGJfLC.ngicj6.8FJOo034WubsFgwJilNTw6tO', 'job_seeker')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role);

INSERT INTO profiles (user_id, phone, location, experience_years, skills, resume_url, education, work_experience, portfolio_url)
VALUES
(3, '+1-9999999999', 'San Francisco, CA', 4, JSON_ARRAY('React', 'Node.js', 'MySQL'), 'https://example.com/resume.pdf', 'B.Tech CSE', 'Worked on SaaS dashboards', 'https://github.com/seeker')
ON DUPLICATE KEY UPDATE location = VALUES(location);

INSERT INTO jobs (
  title, company_name, description, skills_required, experience_min, experience_max, job_type,
  location_address, salary, referrer_name, referrer_email, referral_id,
  visa_sponsorship_available, application_deadline, openings, posted_by, status
)
VALUES
('Frontend Engineer', 'Acme Labs', 'Build high-performance React interfaces.', JSON_ARRAY('React', 'TypeScript', 'CSS'), 2, 5, 'remote',
 'New York, NY', '$120k-$150k', 'Poster One', 'poster@refjobs.com', 'REF123', TRUE, '2026-06-30', 2, 2, 'approved'),
('Backend Engineer', 'CloudNova', 'Work on APIs and data systems.', JSON_ARRAY('Node.js', 'MySQL', 'Docker'), 3, 6, 'office',
 'Austin, TX', '$130k-$165k', 'Poster One', 'poster@refjobs.com', NULL, FALSE, '2026-07-15', 1, 2, 'pending')
ON DUPLICATE KEY UPDATE title = VALUES(title);
