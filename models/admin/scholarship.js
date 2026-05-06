const { pool } = require('../../config/db');

const getScholar_types = async () => {
    let [rows] = await pool.query('SELECT * FROM scholarship_types');
    return rows;
}

const findScholarshipTypeByName = async (name) => {
    let [rows] = await pool.query('SELECT * FROM scholarship_types WHERE name = ?', [name]);
    return rows;
}


const createScholarshipType = async (body) => {
    let arrs = [body.name];
    let [results] = await pool.query('INSERT INTO scholarship_types (name) VALUES (?)', arrs);
    const [rows] = await pool.query('SELECT id, name, created_at FROM scholarship_types WHERE id = ?',[results.insertId]);

    return rows;
}

const updateScholarshipType = async (id, body) => {
    let arrs = [body.name, id];
    let [results] = await pool.query('UPDATE scholarship_types SET name = ? WHERE id = ?', arrs);
    let [rows] = await pool.query('SELECT id, name, created_at FROM scholarship_types WHERE id = ?',[id]);

    return rows;
}

const deleteScholarshipType = async (id) => {
    let [rows] = await pool.query('DELETE FROM scholarship_types WHERE id = ?', [id]);

    return rows;
}


module.exports = {
    findScholarshipTypeByName,
    createScholarshipType,
    getScholar_types,
    updateScholarshipType,
    deleteScholarshipType
}