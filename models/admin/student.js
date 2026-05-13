const { pool } = require("../../config/db");

const baseSelectForAddStudent = `
    SELECT 
        cs.id, cs.student_id, s.fullname, s.profile_url, s.gender, s.phone, s.status, cs.class_id, 
        c.name as class_name, c.description as class_desc,
        gen.id AS generation_id, gen.name AS generation_name, gen.description AS generation_desc,
        sch.id AS scholarship_id, sch.name AS scholarship_name, sch.description AS scholarship_desc, 
        shi.id AS shift_id, shi.name AS shift_name, cs.created_at
`;

const baseJoinsForAddStudent = `
    FROM class_students cs
    JOIN students s ON cs.student_id = s.id
    LEFT JOIN generations gen ON s.generation_id = gen.id
    LEFT JOIN scholarships sch ON s.scholarship_id = sch.id
    LEFT JOIN shifts shi ON s.shift_id = shi.id
    JOIN classes c ON cs.class_id = c.id
`;

const baseSelectForCreateStudent = `
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
`;

const baseJoinsForCreateStudent = `
    FROM students s
    LEFT JOIN class_students cs ON s.id = cs.student_id
    LEFT JOIN classes cla ON cs.class_id = cla.id
    LEFT JOIN generations gen ON s.generation_id = gen.id
    LEFT JOIN scholarships sch ON s.scholarship_id = sch.id
    LEFT JOIN shifts shi ON s.shift_id = shi.id
`;

const findById = async (id, db) => {
  const [rows] = await pool.query(`SELECT id FROM ${db} WHERE id = ?`, [id]);
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(`SELECT * FROM students WHERE id = ?`, [id]);

  return rows;
};

const getFullInfoById = async (id) => {
  const sql = `
    ${baseSelectForCreateStudent}
    ${baseJoinsForCreateStudent}
    WHERE s.id = ?
  `;
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
};

const checkPhone = async (phone) => {
  const [row] = await pool.query("SELECT phone FROM students WHERE phone = ?", [
    phone,
  ]);
  return row;
};

const checkStudentInClass = async (student_id) => {
  const sql = `SELECT * FROM class_students WHERE student_id = ?`;
  const [rows] = await pool.query(sql, [student_id]);
  return rows;
}

const insertStudent = async (body, imageUrl, cloudinaryId) => {
  const arrs = [
    body.fullname,
    imageUrl,
    cloudinaryId,
    body.gender,
    body.phone,
    body.generation_id,
    body.scholarship_id,
    body.shift_id,
    body.status,
  ];
  let [result] = await pool.query(
    "INSERT INTO students (fullname, profile_url, cloudinary_id, gender, phone, generation_id, scholarship_id, shift_id, status) VALUES (?,?,?,?,?,?,?,?,?)",
    arrs,
  );

  return result.insertId;
};

const updateStudentInfo = async (id, body) => {
  let arrs = [
    body.fullname || null,
    body.gender ?? null,
    body.phone || null,
    body.generation_id || null,
    body.scholarship_id || null,
    body.shift_id || null,
    body.status || null,
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

const getAllStudents = async (limit, offset, sortColumn, sortDirection) => {
  const sql = `
    ${baseSelectForCreateStudent}
    ${baseJoinsForCreateStudent}
    ORDER BY s.?? ${sortDirection} 
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(sql, [sortColumn, limit, offset]);
  return rows;
};

const countStudents = async () => {
  const sql = `SELECT COUNT(*) as total FROM students`;
  const [rows] = await pool.query(sql);
  return rows[0].total;
};

const countStudentsByClassId = async (classId) => {
  const sql = `SELECT COUNT(*) as total FROM class_students cs
  LEFT JOIN students s ON cs.class_id = s.id where cs.class_id = ?`;
  const [rows] = await pool.query(sql, [classId]);
  return rows[0].total;
}

const countClassesByStudentId = async (studentId) => {
  const sql = `SELECT COUNT(*) as total FROM class_students cs
  LEFT JOIN classes c ON cs.class_id = c.id where cs.student_id = ?`;
  const [rows] = await pool.query(sql, [studentId]);
  return rows[0].total;
}

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
  return rows;
}

const removeStudentFromClass = async (class_id, student_id) => {
  const sql = `DELETE FROM class_students WHERE class_id = ? AND student_id = ?`;
  await pool.query(sql, [class_id, student_id]);
};

const getStudentsByClassId = async (classId, limit, offset, sortColumn, sortDirection) => {
const sql = `
        ${baseSelectForAddStudent} 
        ${baseJoinsForAddStudent} 
        WHERE cs.class_id = ? 
        ORDER BY ?? ${sortDirection} 
        LIMIT ? OFFSET ?
    `;
  const [rows] = await pool.query(sql, [classId, sortColumn, limit, offset]);
  return rows;
};

const getClassesByStudentId = async (studentId, limit, offset, sortColumn, sortDirection) => {
const sql = `
        ${baseSelectForAddStudent} 
        ${baseJoinsForAddStudent} 
        WHERE cs.student_id = ? 
        ORDER BY ?? ${sortDirection} 
        LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [studentId, sortColumn, limit, offset]);
    return rows;
};

module.exports = {
  checkPhone,
  checkStudentInClass,
  findById,
  getById,
  insertStudent,
  updateStudentInfo,
  updateStudentProfile,
  deleteStudent,
  getAllStudents,
  countStudents,
  addStudentToClass,
  getInfoStudentIntoClass,
  findStudentInClass,
  getFullInfoById,
  removeStudentFromClass,
  getStudentsByClassId,
  countStudentsByClassId,
  getClassesByStudentId,
  countClassesByStudentId,
};
