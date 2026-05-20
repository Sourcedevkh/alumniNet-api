DROP DATABASE IF EXISTS AlumniNet;
CREATE DATABASE AlumniNet;
USE AlumniNet;

CREATE TABLE scholarship_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TINYINT NOT NULL DEFAULT 0 COMMENT '0: Morning, 1: Afternoon, 2: Evening',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credit INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE scholarship_subtypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES scholarship_types(id) ON DELETE CASCADE
);

CREATE TABLE scholarship_tracks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subtype_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subtype_id) REFERENCES scholarship_subtypes(id) ON DELETE CASCADE
);

CREATE TABLE scholarships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type_id INT,                        
    subtype_id INT,                     
    track_id INT,                       
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES scholarship_types(id),
    FOREIGN KEY (subtype_id) REFERENCES scholarship_subtypes(id),
    FOREIGN KEY (track_id) REFERENCES scholarship_tracks(id)
);

CREATE TABLE scholarship_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scholarship_id INT NOT NULL,
    subject_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    UNIQUE KEY unique_scholarship_subject (scholarship_id, subject_id)
);

CREATE TABLE generations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    scholarship_id INT NULL,
    intake_month VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id)
);

CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    generation_id INT,
    scholarship_id INT,
    shift_id INT,
    status TINYINT DEFAULT 1 COMMENT '1: Active, 0: Closed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (generation_id) REFERENCES generations(id),
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id),
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    gender TINYINT NOT NULL DEFAULT 0 COMMENT '0=Male, 1=Female',
    profile_url VARCHAR(500) NULL,
    cloudinary_id VARCHAR(225) NULL,
    phone VARCHAR(20) NULL,
    generation_id INT NOT NULL,
    scholarship_id INT NOT NULL,
    shift_id INT NOT NULL,
    status ENUM('Graduate') NOT NULL DEFAULT 'Graduate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (generation_id) REFERENCES generations(id),
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id),
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
);

CREATE TABLE class_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_class (student_id, class_id)
);

CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    grade VARCHAR(10) NULL,
    gpa DECIMAL(3,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    issued_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname varchar(255) NOT NULL,
    gender TINYINT NULL DEFAULT 0 COMMENT '0=Male, 1=Female',
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_url VARCHAR(500) NULL,
    cloudinary_id VARCHAR(225) NULL,
    token TEXT,
    reset_token VARCHAR(100) NULL,
    reset_token_expires DATETIME NULL,
    phone VARCHAR(20),
    address TEXT,
    role TINYINT NOT NULL DEFAULT 1 COMMENT '0: super_admin, 1: admin',
    is_active TINYINT NOT NULL DEFAULT 1,
    is_verified TINYINT DEFAULT 0,
    verification_token VARCHAR(255) DEFAULT NULL,
    verification_expires DATETIME DEFAULT NULL,
    otp_code VARCHAR(6) DEFAULT NULL,
    otp_expires_at DATETIME DEFAULT NULL,
    last_login_at DATETIME NULL,
    last_login_ip VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    device_name VARCHAR(100),
    browser_name VARCHAR(100),
    user_agent TEXT,
    last_ip VARCHAR(45),
    last_login_at DATETIME,
    is_trusted TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_device (device_id)
);

CREATE TABLE login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    attempt_count INT DEFAULT 1,
    blocked_until DATETIME NULL,
    block_level TINYINT DEFAULT 0 COMMENT '0=none, 1=5min, 2=10min, 3=permanent',
    last_attempt_at DATETIME,
    UNIQUE KEY unique_attempt (user_id, device_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
