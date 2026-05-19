-- Insert data info AlumniNet database

# Scholarship Types
INSERT INTO scholarship_types (name) VALUES ('Cyber Security'),('Software Development');

#  Shifts
INSERT INTO shifts (name) VALUES
(0), -- Morning
(1), -- Afternoon
(2); -- Evening

# Subjects
INSERT INTO subjects (name, credit) VALUES ('C++', 3), ('Javascript', 4);

# Scholarship Subject Types
INSERT INTO scholarship_subtypes (type_id, name) VALUES (1, 'Cyber'), (2, 'Web development');

# Scholarship Tracks
INSERT INTO scholarship_tracks (subtype_id, name) VALUES(1, 'C++'), (2, 'Node.js');

# Scholarships
INSERT INTO scholarships (name, type_id, subtype_id, track_id) VALUES('Software Development', 2, 2, 2);

# Generations
INSERT INTO generations (name, start_year, end_year, scholarship_id, intake_month) VALUES ('Gen 1', 2025, 2026, 1, 'January');

# Classes
INSERT INTO classes (name, generation_id, scholarship_id, shift_id) VALUES ('M202', 1, 1, 1);

# Students
INSERT INTO students (fullname, email, gender, generation_id, scholarship_id, shift_id) VALUES ('Som Channa', 'Channa@gamil.com' ,0, 1, 1, 1);

# Add student into classes
INSERT INTO class_students (student_id, class_id) VALUES (1, 1);

# Scores
INSERT INTO scores (student_id, subject_id, score) VALUES (1, 1, 85);

# Grades
INSERT INTO grades (student_id, grade, gpa) VALUES (1, 'A', 3.80);

# Certificates
INSERT INTO certificates (student_id, issued_at) VALUES (1, NOW());