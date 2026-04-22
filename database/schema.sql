CREATE DATABASE IF NOT EXISTS referral_jobs;
USE referral_jobs;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('job_seeker', 'job_poster', 'admin') NOT NULL DEFAULT 'job_seeker',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  phone VARCHAR(30),
  location VARCHAR(180),
  experience_years INT DEFAULT 0,
  skills JSON,
  resume_url VARCHAR(500),
  education TEXT,
  work_experience TEXT,
  portfolio_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  company_name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  skills_required JSON,
  experience_min INT DEFAULT 0,
  experience_max INT DEFAULT 0,
  job_type ENUM('remote', 'office', 'wfh') NOT NULL,
  location_address VARCHAR(255) NOT NULL,
  salary VARCHAR(120),
  referrer_name VARCHAR(120),
  referrer_email VARCHAR(180),
  referral_id VARCHAR(120),
  visa_sponsorship_available BOOLEAN DEFAULT FALSE,
  application_deadline DATE,
  openings INT DEFAULT 1,
  posted_by INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_jobs_user FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  job_id INT NOT NULL,
  resume_url VARCHAR(500),
  note TEXT,
  match_percent INT DEFAULT 0,
  status ENUM('submitted', 'shortlisted', 'rejected', 'hired') DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_application_per_job (user_id, job_id),
  CONSTRAINT fk_app_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  job_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_saved_job (user_id, job_id),
  CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_saved_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
