const { pool } = require("../../config/db");

const findById = async (id, db) => {
  const [rows] = await pool.query(`SELECT id FROM ${db} WHERE id = ?`, [id]);

  return rows[0];
};

const getById = async (id) => {
  const rows = await pool.query(`SELECT * FROM students WHERE id = ?`, [id]);

  return rows;
};

const checkPhone = async (phone) => {
  let row = await pool.query("SELECT phone FROM students WHERE phone = ?", [
    phone,
  ]);
  return row;
};

const insertStudent = async (body, imageUrl, cloudinaryId) => {
  const {
    name,
    gender,
    phone,
    generation_id,
    scholarship_id,
    class_id,
    shift_id,
    status,
  } = body;
  const arrs = [
    name,
    imageUrl,
    cloudinaryId,
    gender,
    phone,
    generation_id,
    scholarship_id,
    class_id,
    shift_id,
    status,
  ];
  let [result] = await pool.query(
    "INSERT INTO students (name, profile_url, cloudinary_id, gender, phone, generation_id, scholarship_id, class_id, shift_id, status) VALUES (?,?,?,?,?,?,?,?,?,?)",
    arrs,
  );

  return result.insertId;
};

module.exports = {
  checkPhone,
  findById,
  getById,
  insertStudent,
};
