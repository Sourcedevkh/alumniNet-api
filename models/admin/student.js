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
    fullname,
    gender,
    phone,
    generation_id,
    scholarship_id,
    class_id,
    shift_id,
    status,
  } = body;
  const arrs = [
    fullname,
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
    "INSERT INTO students (fullname, profile_url, cloudinary_id, gender, phone, generation_id, scholarship_id, class_id, shift_id, status) VALUES (?,?,?,?,?,?,?,?,?,?)",
    arrs,
  );

  return result.insertId;
};



const updateStudentInfo = async (id, body) => {
    const {
    fullname,
    gender,
    phone,
    generation_id,
    scholarship_id,
    class_id,
    shift_id,
    status,
  } = body;
    let arrs = [fullname || null, gender ?? null, phone || null, generation_id || null, scholarship_id || null, class_id || null, shift_id || null, status || null, id];
    const sql = `UPDATE students SET fullname = COALESCE(?, fullname), gender = COALESCE(?, gender), phone  = COALESCE(?, phone), generation_id = COALESCE(?, generation_id), scholarship_id = COALESCE(?, scholarship_id), class_id = COALESCE(?, class_id), shift_id = COALESCE(?, shift_id), status = COALESCE(?, status) WHERE id = ?`;

    const [result] = await pool.query(sql, arrs);
    return result.affectedRows > 0;
}

const updateStudentProfile = async (id, imageUrl, cloudinaryId) => {
    let arrs = [imageUrl, cloudinaryId, id];
    const sql = `UPDATE students SET profile_url = COALESCE(?, profile_url), cloudinary_id = COALESCE(?, cloudinary_id) WHERE id = ?`;
    const [result] = await pool.query(sql, arrs);
    return result.affectedRows > 0;
}

const deleteStudent = async (id) => {
  const sql = `DELETE FROM students WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
  return result.affectedRows > 0;
}

const getAllStudents = async () => {
  const [students] = await pool.query("SELECT * FROM students");
  return students;
};

module.exports = {
  checkPhone,
  findById,
  getById,
  getAllStudents,
  insertStudent,
  updateStudentInfo,
  updateStudentProfile,
  deleteStudent
};
