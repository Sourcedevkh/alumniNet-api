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
    const [rows] = await pool.query('SELECT id, name, created_at FROM scholarship_types WHERE id = ?', [results.insertId]);

    return rows;
}

const updateScholarshipType = async (id, body) => {
    let arrs = [body.name, id];
    let [results] = await pool.query('UPDATE scholarship_types SET name = ? WHERE id = ?', arrs);
    let [rows] = await pool.query('SELECT id, name, created_at FROM scholarship_types WHERE id = ?', [id]);

    return rows;
}

const deleteScholarshipType = async (id) => {
    let [rows] = await pool.query('DELETE FROM scholarship_types WHERE id = ?', [id]);

    return rows;
}

const getAllScholarshipSubjects = async () => {
    let [rows] = await pool.query('SELECT ss.*, st.name AS type_name FROM scholarship_subtypes ss JOIN scholarship_types st ON ss.type_id = st.id ORDER BY ss.id DESC')
    return rows;
}

const checkTypeIdExist = async (type_id) => {
    let [rows] = await pool.query('SELECT id FROM scholarship_types WHERE id = ?', [type_id]);
    return rows;
}

const createScholarshipSubject = async (body) => {
    const [result] = await pool.query(
        'INSERT INTO scholarship_subtypes (type_id, name) VALUES (?, ?)',
        [body.type_id, body.name]
    );

    const [rows] = await pool.query(`
        SELECT ss.*, st.name AS type_name 
        FROM scholarship_subtypes ss
        JOIN scholarship_types st ON ss.type_id = st.id
        WHERE ss.id = ?
    `, [result.insertId]);

    return rows[0];
};

const updateScholarshipSubject = async (id, body) => {
    let arrs = [body.type_id, body.name, id];
    let [results] = await pool.query('UPDATE scholarship_subtypes SET type_id = ?, name = ? WHERE id = ?', arrs);
    let [rows] = await pool.query('SELECT ss.*, st.name AS type_name FROM scholarship_subtypes ss JOIN scholarship_types st ON ss.type_id = st.id WHERE ss.id = ?', [id]);

    return rows;
}

const deleteScholarshipSubject = async (id) => {
    let [rows] = await pool.query('DELETE FROM scholarship_subtypes WHERE id = ?', [id]);

    return rows;
}

const getAllScholarshipTracks = async () => {
    const [rows] = await pool.query(`
        SELECT 
            st.id,
            st.subtype_id,
            ss.name AS subtype_name,
            st.name,
            st.created_at
        FROM scholarship_tracks st
        JOIN scholarship_subtypes ss 
            ON st.subtype_id = ss.id
        ORDER BY st.id DESC
    `);

    return rows;
};

const getScholarshipTrackById = async (id) => {
    const [rows] = await pool.query(`
        SELECT 
            st.id,
            st.subtype_id,
            ss.name AS subtype_name,
            st.name,
            st.created_at
        FROM scholarship_tracks st
        JOIN scholarship_subtypes ss 
            ON st.subtype_id = ss.id
        WHERE st.id = ?
    `, [id]);
}

const findScholarshipTrackByName = async (name) => {
    let [rows] = await pool.query('SELECT id FROM scholarship_tracks WHERE name = ?', [name]);
    return rows;
}


const checkScholarshipTypeIdExist = async (type_id) => {
    let [rows] = await pool.query('SELECT id FROM scholarship_subtypes WHERE id = ?', [type_id]);

    return rows;
}
const createScholarshipTrack = async (body) => {

    let [results] = await pool.query(
        'INSERT INTO scholarship_tracks (subtype_id, name) VALUES (?, ?)',
        [body.subtype_id, body.name]
    );

    const [rows] = await pool.query(`
        SELECT 
            st.id,
            st.subtype_id,
            ss.name AS subtype_name,
            st.name,
            st.created_at
        FROM scholarship_tracks st
        JOIN scholarship_subtypes ss 
            ON st.subtype_id = ss.id
        WHERE st.id = ?
    `, [results.insertId]);

    return rows[0];
};

const updateScholarshipTrack = async (id, body) => {
    let arrs = [body.subtype_id, body.name, id];
    let [results] = await pool.query('UPDATE scholarship_tracks SET subtype_id = ?, name = ? WHERE id = ?', arrs);
    let [rows] = await pool.query(`
        SELECT 
            st.id,
            st.subtype_id,
            ss.name AS subtype_name,
            st.name,
            st.created_at
        FROM scholarship_tracks st
        JOIN scholarship_subtypes ss 
            ON st.subtype_id = ss.id
        WHERE st.id = ?
    `, [id]);

    return rows;
}

const deleteScholarshipTrack = async (id) => {
    let [rows] = await pool.query('DELETE FROM scholarship_tracks WHERE id = ?', [id]);

    return rows;
}



module.exports = {
    findScholarshipTypeByName,
    createScholarshipType,
    getScholar_types,
    updateScholarshipType,
    deleteScholarshipType,
    getAllScholarshipSubjects,
    createScholarshipSubject,
    checkTypeIdExist,
    updateScholarshipSubject,
    deleteScholarshipSubject,
    createScholarshipTrack,
    getScholarshipTrackById,
    findScholarshipTrackByName,
    getAllScholarshipTracks,
    checkScholarshipTypeIdExist,
    updateScholarshipTrack,
    deleteScholarshipTrack
}