const { pool } = require('../../config/db');

const getCertiDataByStudentId = async (studentId) => {
    const [rows] = await pool.query(
        `SELECT
             s.id AS student_id,
             s.fullname,
             s.email,
             s.gender,
             g.name AS generation_name,
             g.start_year,
             g.end_year,
             sch.name AS scholarship_name,
             CASE sh.name
                 WHEN '0' THEN 'Morning'
                 WHEN '1' THEN 'Afternoon'
                 WHEN '2' THEN 'Evening'
                 ELSE 'Unknown'
                 END AS shift_name,
             gr.grade,
             gr.gpa,
             NOW() AS issued_at
         FROM students s
                  JOIN generations g ON s.generation_id = g.id
                  JOIN scholarships sch ON s.scholarship_id = sch.id
                  JOIN shifts sh ON s.shift_id = sh.id
                  LEFT JOIN grades gr ON s.id = gr.student_id
         WHERE s.id = ? LIMIT 1`,
        [studentId]
    );

    return rows[0];
}

module.exports = {
    getCertiDataByStudentId
};  