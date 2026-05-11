const { pool } = require("../../config/db");

const getAllGenerations = async () => {
  const [rows] = await pool.query(
    `SELECT
            g.*,
            s.name AS scholarship_name,
            st.name AS scholarship_type
        FROM generations g
        LEFT JOIN scholarships s ON g.scholarship_id = s.id
        LEFT JOIN scholarship_types st ON s.type_id = st.id`,
  );
  return rows;
}

const createGeneration = async (body) => {
  // 1. Check duplicate 'name' ជាមុនសិន
  const [existing] = await pool.query(
    `SELECT id FROM generations WHERE name = ? LIMIT 1`,
    [body.name]
  );

  if (existing.length > 0) {
    // បោះ Error ប្រាប់ថាឈ្មោះនេះមានរួចហើយ (ជៀសវាង Duplicate)
    const error = new Error("Generation name already exists!");
    error.status = 400; 
    throw error;
  }

  // 2. ប្រសិនបើមិនទាន់មានឈ្មោះហ្នឹងទេ ទើបអនុញ្ញាតឱ្យ INSERT
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
    arr,
  );

  // 3. ទាញយកទិន្នន័យដែលទើបតែបញ្ចូលរួចមកបង្ហាញវិញ
  const [rows] = await pool.query(
    `SELECT 
            g.*, 
            s.name AS scholarship_name, 
            st.name AS scholarship_type 
        FROM generations g
        LEFT JOIN scholarships s ON g.scholarship_id = s.id
        LEFT JOIN scholarship_types st ON s.type_id = st.id
        WHERE g.id = ?`,
    [result.insertId],
  );

  return rows[0];
};

const checkDuplicateName = async (name) => {
    // ប្រើ pool.query ដើម្បីឆែកក្នុង database
    const [rows] = await pool.query(
        "SELECT id FROM generations WHERE name = ? LIMIT 1",
        [name]
    );
    return rows.length > 0; // បើមាន បោះតម្លៃ true បើអត់បោះ false
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
    [id],
  );

  return rows[0];
};

const updateGeneration = async (id, body) => {
  const arr = [
    body.name,
    body.description,
    body.start_year,
    body.end_year,
    body.scholarship_id,
    body.intake_month,
    id,
  ];
  const [result] = await pool.query(
    `UPDATE generations
        SET name = ?, description = ?, start_year = ?, end_year = ?, scholarship_id = ?, intake_month = ? 
        WHERE id = ?`,
    arr,
  );
  const [rows] = await pool.query(
    `SELECT
            g.*,
            s.name AS scholarship_name,
            st.name AS scholarship_type
        FROM generations g
        LEFT JOIN scholarships s ON g.scholarship_id = s.id
        LEFT JOIN scholarship_types st ON s.type_id = st.id
        WHERE g.id = ?`,
    [id],
  );

  return rows[0];
};



const deleteGeneration = async (id) => {
  const [result] = await pool.query(`DELETE FROM generations WHERE id = ?`, [
    id,
  ]);
  return result;
};

module.exports = {
  getAllGenerations,
  createGeneration,
  findGenerationByid,
  updateGeneration,
  deleteGeneration,
  checkDuplicateName,
};
