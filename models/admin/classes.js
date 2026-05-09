const { pool } = require('../../config/db');

const findByName = async (name) => {
    let [rows] = await pool.query('SELECT id FROM classes WHERE name = ?', [name]);
    return rows;
}

const create = async (data) => {
    const params = [
        data.name,
        data.description,
        data.generation_id,
        data.scholarship_id,
        data.shift_id
    ];

    const sql = `INSERT INTO classes (name, description, generation_id, scholarship_id, shift_id) VALUES (?, ?, ?, ?, ?)`;

    const [results] = await pool.query(sql, params);
    return results.insertId;
}

const getClassbyId = async (classId) => {
    const classSql = `
        SELECT c.id, c.name, c.description, c.created_at, 
               g.name AS generation_name, 
               s.name AS scholarship_name,
               sh.name AS shift_value
        FROM classes c
        LEFT JOIN generations g ON c.generation_id = g.id
        LEFT JOIN scholarships s ON c.scholarship_id = s.id
        LEFT JOIN shifts sh ON c.shift_id = sh.id
        WHERE c.id = ?`;

    const [classResult] = await pool.query(classSql, [classId]);
    if (classResult.length === 0) return null;

    const classInfo = classResult[0];
    const studentQuery = `
        SELECT 
            s.id AS student_id,
            s.fullname,
            s.gender,
            s.profile_url,
            g.name AS generation_name,
            sh.name AS shift_name,
            st.name AS scholarship_name,
            cs.created_at AS enrollment_date
        FROM class_students cs
        INNER JOIN students s ON cs.student_id = s.id
        LEFT JOIN generations g ON s.generation_id = g.id
        LEFT JOIN shifts sh ON s.shift_id = sh.id
        LEFT JOIN scholarships st ON s.scholarship_id = st.id
        WHERE cs.class_id = ?
        ORDER BY s.fullname ASC
    `;

    const [students] = await pool.query(studentQuery, [classId]);
    return {
        id: classInfo.id,
        name: classInfo.name,
        description: classInfo.description,
        metadata: {
            generation: classInfo.generation_name,
            scholarship: classInfo.scholarship_name,
            shift: classInfo.shift_value
        },
        total_students: students.length,
        students: students
    };
};

const findById = async (id) => {
    let [rows] = await pool.query('SELECT * FROM classes WHERE id = ?', [id]);
    return rows;
}

const getAllClasses = async () => {
    const sql = `
    SELECT 
        c.id, 
        c.name AS class_name, 
        c.description,
        c.created_at,
        g.name AS generation_name,
        sc.name AS scholarship_name,
        sh.name AS shift_value,
        (SELECT COUNT(*) FROM class_students WHERE class_id = c.id) AS student_count
    FROM classes c
    LEFT JOIN generations g ON c.generation_id = g.id
    LEFT JOIN scholarships sc ON c.scholarship_id = sc.id
    LEFT JOIN shifts sh ON c.shift_id = sh.id
    ORDER BY c.created_at DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
};

const update = async (id, data) => {
    let arrs = [data.name, data.description, data.generation_id, data.scholarship_id, data.shift_id, id];
    const sql = `UPDATE classes SET name = COALESCE(?, name), description = COALESCE(?, description), generation_id = COALESCE(?, generation_id), scholarship_id = COALESCE(?, scholarship_id), shift_id = COALESCE(?, shift_id) WHERE id = ?`;
    const [result] = await pool.query(sql, arrs);
    return result.affectedRows > 0;
}

module.exports = {
    findByName,
    create,
    getClassbyId,
    findById,
    getAllClasses,
    update
};