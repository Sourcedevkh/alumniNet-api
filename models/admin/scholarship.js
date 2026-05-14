const { pool } = require('../../config/db');

const getScholar_types = async () => {
    let [rows] = await pool.query('SELECT * FROM scholarship_types');
    return rows;
}

const findScholarshipTypeByName = async (name) => {
    let [rows] = await pool.query('SELECT * FROM scholarship_types WHERE name = ?', [name]);
    return rows;
}

const getScholarshipTypeById = async (id) => {
    let [rows] = await pool.query('SELECT * FROM scholarship_types WHERE id = ?', [id]);
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

const findScholarshipSubjectByName = async (name) => {
    let [rows] = await pool.query('SELECT * FROM scholarship_subtypes WHERE name = ?', [name]);
    return rows;
}

const getScholarshipSubjectById = async (id) => {
    let [rows] = await pool.query('SELECT ss.*, st.name AS type_name FROM scholarship_subtypes ss JOIN scholarship_types st ON ss.type_id = st.id WHERE ss.id = ?', [id]);
    return rows;
}
const createScholarshipSubject = async (body) => {
    const [result] = await pool.query(
        'INSERT INTO scholarship_subtypes (type_id, name) VALUES (?, ?)',
        [body.type_id, body.name]
    );

    const [rows] = await pool.query('SELECT ss.*, st.name AS type_name FROM scholarship_subtypes ss JOIN scholarship_types st ON ss.type_id = st.id WHERE ss.id = ?', [result.insertId]);

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

const findScholarshipByName = async (name) => {
    const [rows] = await pool.query(
        `SELECT * FROM scholarships WHERE LOWER(name) = LOWER(?)`,
        [name]
    );
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

const getScholarshipById = async (id) => {
    const [rows] = await pool.query(
        `SELECT
            s.id,
            s.name,
            s.description,
            s.type_id,
            st.name AS type_name,
            s.subtype_id,
            ss.name AS subtype_name,
            s.track_id,
            stt.name AS track_name,
            s.created_at,
            s.updated_at
        FROM scholarships s
        LEFT JOIN scholarship_types st ON s.type_id = st.id
        LEFT JOIN scholarship_subtypes ss ON s.subtype_id = ss.id
        LEFT JOIN scholarship_tracks stt ON s.track_id = stt.id
        WHERE s.id = ?`,
        [id]
    );

    return rows;
}

const getAllScholarships = async () => {
    const [rows] = await pool.query(
        `SELECT
            s.id,
            s.name,
            s.description,
            s.type_id,
            st.name AS type_name,
            s.subtype_id,
            ss.name AS subtype_name,
            s.track_id,
            stt.name AS track_name,
            s.created_at,
            s.updated_at
        FROM scholarships s
        LEFT JOIN scholarship_types st ON s.type_id = st.id
        LEFT JOIN scholarship_subtypes ss ON s.subtype_id = ss.id
        LEFT JOIN scholarship_tracks stt ON s.track_id = stt.id
        ORDER BY s.id DESC`
    );

    return rows;
}

const getScholarshipSubjects = async (scholarship_id) => {
    const [rows] = await pool.query(
        `SELECT subj.id AS subject_id, subj.name AS subject_name
         FROM scholarship_subjects ss
         JOIN subjects subj ON ss.subject_id = subj.id
         WHERE ss.scholarship_id = ?`,
        [scholarship_id]
    );

    return rows;
}

const getScholarshipSubjectsBatch = async (scholarshipIds) => {
    if (!Array.isArray(scholarshipIds) || scholarshipIds.length === 0) {
        return [];
    }

    const placeholders = scholarshipIds.map(() => '?').join(',');
    const [rows] = await pool.query(
        `SELECT ss.scholarship_id, subj.id AS subject_id, subj.name AS subject_name
         FROM scholarship_subjects ss
         JOIN subjects subj ON ss.subject_id = subj.id
         WHERE ss.scholarship_id IN (${placeholders})`,
        scholarshipIds
    );

    return rows;
}

const checkScholarshipTrackIdExist = async (track_id) => {
    const [rows] = await pool.query('SELECT id FROM scholarship_tracks WHERE id = ?', [track_id]);
    return rows;
}

const createScholarship = async (body) => {
    const [result] = await pool.query(
        'INSERT INTO scholarships (name, description, type_id, subtype_id, track_id) VALUES (?, ?, ?, ?, ?)',
        [body.name, body.description || null, body.type_id || null, body.subtype_id || null, body.track_id || null]
    );

    return result.insertId;
}

const updateScholarship = async (id, body) => {
    const arrs = [
        body.name || null,
        body.description || null,
        body.type_id || null,
        body.subtype_id || null,
        body.track_id || null,
        id,
    ];

    const [result] = await pool.query(
        `UPDATE scholarships
         SET name = COALESCE(?, name),
             description = COALESCE(?, description),
             type_id = COALESCE(?, type_id),
             subtype_id = COALESCE(?, subtype_id),
             track_id = COALESCE(?, track_id)
         WHERE id = ?`,
        arrs
    );

    return result.affectedRows > 0;
}

const deleteScholarship = async (id) => {
    const [rows] = await pool.query('DELETE FROM scholarships WHERE id = ?', [id]);
    return rows;
}

const deleteScholarshipSubjects = async (scholarship_id) => {
    await pool.query('DELETE FROM scholarship_subjects WHERE scholarship_id = ?', [scholarship_id]);
}

const addScholarshipSubjects = async (scholarship_id, subjectIds) => {
    if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
        return;
    }

    const values = subjectIds.map((subject_id) => [scholarship_id, subject_id]);
    await pool.query('INSERT INTO scholarship_subjects (scholarship_id, subject_id) VALUES ?', [values]);
}

const checkScholarshipIdExist = async (id) => {
    const [rows] = await pool.query('SELECT id FROM scholarships WHERE id = ?', [id]);
    return rows;
}

const checkSubjectIdsExist = async (subjectIds) => {
    if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
        return [];
    }

    const placeholders = subjectIds.map(() => '?').join(',');
    const [rows] = await pool.query(`SELECT id FROM subjects WHERE id IN (${placeholders})`, subjectIds);
    return rows.map((row) => row.id);
}

module.exports = {
    findScholarshipTypeByName,
    getScholarshipTypeById,
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
    deleteScholarshipTrack,
    findScholarshipSubjectByName,
    getScholarshipById,
    getAllScholarships,
    getScholarshipSubjectById,
    getScholarshipSubjects,
    createScholarship,
    updateScholarship,
    deleteScholarship,
    deleteScholarshipSubjects,
    addScholarshipSubjects,
    checkScholarshipIdExist,
    checkSubjectIdsExist,
    getScholarshipSubjectsBatch,
    checkScholarshipTrackIdExist,
    findScholarshipByName
}