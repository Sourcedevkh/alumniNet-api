const { pool } = require("../../config/db");

const findById = async (id, db) => {
  const [rows] = await pool.query(`SELECT id FROM ${db} WHERE id = ?`, [id]);

  return rows[0];
};

const getById = async (id) => {
  const rows = await pool.query(`SELECT * FROM students WHERE id = ?`, [id]);

  return rows;
};

const getFullInfoById = async (id) => {
  const sql = `
    SELECT
        s.id AS student_id, 
        s.fullname, 
        s.profile_url, 
        s.gender, 
        s.phone, 
        s.status,
        s.created_at,
        s.updated_at,
        
        gen.id AS generation_id, 
        gen.name AS generation_name, 
        gen.description AS generation_desc, 
        
        sch.id AS scholarship_id, 
        sch.name AS scholarship_name, 
        sch.description AS scholarship_desc, 
        
        shi.id AS shift_id, 
        shi.name AS shift_name,
        
        cla.id AS class_id, 
        cla.name AS class_name, 
        cla.description AS class_desc
    FROM students s
    LEFT JOIN class_students cs ON s.id = cs.student_id
    LEFT JOIN classes cla ON cs.class_id = cla.id
    LEFT JOIN generations gen ON s.generation_id = gen.id
    LEFT JOIN scholarships sch ON s.scholarship_id = sch.id
    LEFT JOIN shifts shi ON s.shift_id = shi.id
    WHERE s.id = ?
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
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
    shift_id,
    status,
  ];
  let [result] = await pool.query(
    "INSERT INTO students (fullname, profile_url, cloudinary_id, gender, phone, generation_id, scholarship_id, shift_id, status) VALUES (?,?,?,?,?,?,?,?,?,?)",
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
    shift_id,
    status,
  } = body;
  let arrs = [
    fullname || null,
    gender ?? null,
    phone || null,
    generation_id || null,
    scholarship_id || null,
    shift_id || null,
    status || null,
    id,
  ];
  const sql = `UPDATE students SET fullname = COALESCE(?, fullname), gender = COALESCE(?, gender), phone  = COALESCE(?, phone), generation_id = COALESCE(?, generation_id), scholarship_id = COALESCE(?, scholarship_id), shift_id = COALESCE(?, shift_id), status = COALESCE(?, status) WHERE id = ?`;

  const [result] = await pool.query(sql, arrs);
  return result.affectedRows > 0;
};

const updateStudentProfile = async (id, imageUrl, cloudinaryId) => {
  let arrs = [imageUrl, cloudinaryId, id];
  const sql = `UPDATE students SET profile_url = COALESCE(?, profile_url), cloudinary_id = COALESCE(?, cloudinary_id) WHERE id = ?`;
  const [result] = await pool.query(sql, arrs);
  return result.affectedRows > 0;
};

const deleteStudent = async (id) => {
  const sql = `DELETE FROM students WHERE id = ?`;
  const [result] = await pool.query(sql, [id]);
  return result.affectedRows > 0;
};

const getAllStudents = async () => {
  const sql = `
SELECT 
    s.id AS student_id, 
    s.fullname, 
    s.profile_url, 
    s.gender, 
    s.phone,
    s.status,
    s.created_at,
    s.updated_at,
    
    gen.id AS generation_id, 
    gen.name AS generation_name, 
    gen.description AS generation_desc, 
    
    sch.id AS scholarship_id, 
    sch.name AS scholarship_name, 
    sch.description AS scholarship_desc, 
    
    shi.id AS shift_id, 
    shi.name AS shift_name,
    
    cla.id AS class_id, 
    cla.name AS class_name, 
    cla.description AS class_desc
FROM students s
JOIN class_students cs ON s.id = cs.student_id
JOIN classes cla ON cs.class_id = cla.id
JOIN generations gen ON s.generation_id = gen.id
JOIN scholarships sch ON s.scholarship_id = sch.id
JOIN shifts shi ON s.shift_id = shi.id;`;
  const [students] = await pool.query(sql);
  return students;
};

const findStudents = async (limit, offset, sortColumn, sortDirection) => {
  // ប្រមូលផ្តុំទិន្នន័យពីតារាងពាក់ព័ន្ធទាំងអស់ដោយប្រើ LEFT JOIN
  const sql = `
    SELECT 
        s.id AS student_id, 
        s.fullname, 
        s.profile_url, 
        s.gender, 
        s.phone, 
        s.status,
        s.created_at,
        s.updated_at,
        
        gen.id AS generation_id, 
        gen.name AS generation_name, 
        gen.description AS generation_desc, 
        
        sch.id AS scholarship_id, 
        sch.name AS scholarship_name, 
        sch.description AS scholarship_desc, 
        
        shi.id AS shift_id, 
        shi.name AS shift_name,
        
        cla.id AS class_id, 
        cla.name AS class_name, 
        cla.description AS class_desc
        
    FROM students s
    LEFT JOIN class_students cs ON s.id = cs.student_id
    LEFT JOIN classes cla ON cs.class_id = cla.id
    LEFT JOIN generations gen ON s.generation_id = gen.id
    LEFT JOIN scholarships sch ON s.scholarship_id = sch.id
    LEFT JOIN shifts shi ON s.shift_id = shi.id
    
    ORDER BY s.${sortColumn} ${sortDirection} 
    LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.query(sql, [limit, offset]);
  return rows;
};

const countStudents = async () => {
  const sql = `SELECT COUNT(*) as total FROM students`;
  const [rows] = await pool.query(sql);
  return rows[0].total;
};

const addStudentToClass = async (student_id, class_id) => {
  const sql = `INSERT INTO class_students (student_id, class_id) VALUES (?, ?)`;
  const [result] = await pool.query(sql, [student_id, class_id]);
  return result.insertId;
};

const getInfoStudentIntoClass = async (id) => {
  const sql = `SELECT 
      cs.id, cs.student_id, s.fullname, s.profile_url, s.phone, s.gender, cs.class_id, c.name, c.description, cs.created_at
      FROM class_students cs
      JOIN students s ON cs.student_id = s.id
      JOIN classes c ON cs.class_id = c.id where cs.id = ?`;
  const [rows] = await pool.query(sql, [id]);
  
  return rows;
};

const findStudentInClass = async (student_id, class_id) => {
  const sql = `SELECT * FROM class_students WHERE student_id = ? AND class_id = ?`;
  const [rows] = await pool.query(sql, [student_id, class_id]);
  return rows[0];
}

module.exports = {
  checkPhone,
  findById,
  getById,
  getAllStudents,
  insertStudent,
  updateStudentInfo,
  updateStudentProfile,
  deleteStudent,
  findStudents,
  countStudents,
  addStudentToClass,
  getInfoStudentIntoClass,
  findStudentInClass,
  getFullInfoById,
};
