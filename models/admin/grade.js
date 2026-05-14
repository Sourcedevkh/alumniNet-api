
const { pool } = require('../../config/db'); 

const getAllGrades = async () => {

    const [rows] = await pool.query(`
        SELECT 
            g.id,
            g.student_id,
            s.fullname AS student_name,
            g.grade,
            g.gpa,
            g.created_at,
            g.updated_at
        FROM grades g
        JOIN students s
            ON g.student_id = s.id
        ORDER BY g.id DESC
    `);

    return rows;
};

const getGradeById = async (id) => {

    const [rows] = await pool.query(`
        SELECT 
            g.id,
            g.student_id,
            s.fullname AS student_name,
            g.grade,
            g.gpa,
            g.created_at,
            g.updated_at
        FROM grades g
        JOIN students s
            ON g.student_id = s.id
        WHERE g.id = ?
    `, [id]);

    return rows[0];
};


const checkStudentIdExists = async (student_id) => {

    const [rows] = await pool.query(
        'SELECT id FROM students WHERE id = ?',
        [student_id]
    );

    return rows;
};


const createGrade = async (body) => {
    const [result] = await pool.query(
        'INSERT INTO grades (student_id, grade, gpa) VALUES (?, ?, ?)',
        [body.student_id, body.grade, body.gpa]
    );

    const [rows] = await pool.query(`
        SELECT 
            g.id,
            g.student_id,
            s.fullname AS student_name,
            g.grade,
            g.gpa,
            g.created_at,
            g.updated_at
        FROM grades g
        JOIN students s
            ON g.student_id = s.id
        WHERE g.id = ?
    `, [result.insertId]);

    return rows[0];
};

const updateGrade = async (id, body) => {
    const [result] = await pool.query(
        'UPDATE grades SET student_id = ?, grade = ?, gpa = ? WHERE id = ?',
        [body.student_id, body.grade, body.gpa, id]
    );

    return result;
}

const deleteGrade = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM grades WHERE id = ?',
        [id]
    );

    return result;
}

module.exports = {
    createGrade,
    getAllGrades,
    getGradeById,
    checkStudentIdExists,
    updateGrade,
    deleteGrade
};