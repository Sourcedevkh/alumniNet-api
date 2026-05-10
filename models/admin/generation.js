const { pool } = require("../../config/db");

const createGeneration = async (body) => {
    const arr = [
        body.name,
        body.description,
        body.start_year,
        body.end_year,
        body.scholarship_id,
        body.intake_month,
    ];

    const [result] = await pool.query(
        `INSERT INTO generations 
        (name, description, start_year, end_year, scholarship_id, intake_month) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        arr
    );

    // 👉 JOIN here
    const [rows] = await pool.query(
        `SELECT 
            g.*, 
            s.name AS scholarship_name,
            st.name AS scholarship_type
        FROM generations g
        LEFT JOIN scholarships s ON g.scholarship_id = s.id
        LEFT JOIN scholarship_types st ON s.type_id = st.id
        WHERE g.id = ?`,
        [result.insertId]
    );

    return rows[0];
};

const findGenerationByid = async (id) => {
   const [rows] = await pool.query(
        `SELECT 
            g.*, 
            s.name AS scholarship_name,
            st.name AS scholarship_type
        FROM generations g
        LEFT JOIN scholarships s ON g.scholarship_id = s.id
        LEFT JOIN scholarship_types st ON s.type_id = st.id
        WHERE g.id = ?`,
        [id]
    );

    return rows[0];
};

module.exports = {
    createGeneration,
    findGenerationByid,
};
