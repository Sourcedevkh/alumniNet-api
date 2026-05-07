const { pool } = require("../../config/db");

const createGeneration = async (body) => {
    const arr = [body.name, body.description, body.start_year, body.end_year];
    const [result] = await pool.query(
        "INSERT INTO generations (name, description, start_year, end_year) VALUES (?, ?, ?, ?)",
        arr,
    );

    const [rows] = await pool.query(
        "SELECT id, name, description, start_year, end_year FROM generations WHERE id = ?",
        [result.insertId],
    );
    return rows;
};

const findGenerationByid = async (id) => {
    const [rows] = await pool.query(
        `SELECT g.*, s.name AS scholarship_name, st.name AS track_name
    FROM generations g
    LEFT JOIN scholarships s ON g.scholarship_id = s.id
    LEFT JOIN scholarship_tracks st ON s.track_id = st.id
    WHERE g.id = ?`,
        [id],
    );
    return rows;
};

module.exports = {
    createGeneration,
    findGenerationByid,
};
