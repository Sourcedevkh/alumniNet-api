const { pool } = require("../../config/db");

const getAllScores = async () => {
  const [rows] = await pool.query(`
    SELECT 
      s.id,
      s.student_id,
      st.fullname AS student_name,
      s.subject_id,
      subj.name AS subject_name,
      s.score,
      s.created_at,
      s.updated_at
    FROM scores s
    LEFT JOIN students st ON s.student_id = st.id
    LEFT JOIN subjects subj ON s.subject_id = subj.id
    ORDER BY s.id DESC
  `);

  return rows;
};

const getScoreById = async (id) => {
  const [rows] = await pool.query(`
    SELECT 
      s.id,
      s.student_id,
      st.fullname AS student_name,
      s.subject_id,
      subj.name AS subject_name,
      s.score,
      s.created_at,
      s.updated_at
    FROM scores s
    LEFT JOIN students st ON s.student_id = st.id
    LEFT JOIN subjects subj ON s.subject_id = subj.id
    WHERE s.id = ?
  `, [id]);

  return rows;
};

const checkStudentIdExist = async (student_id) => {
  const [rows] = await pool.query('SELECT id FROM students WHERE id = ?', [student_id]);
  return rows;
};

const checkSubjectIdExist = async (subject_id) => {
  const [rows] = await pool.query('SELECT id FROM subjects WHERE id = ?', [subject_id]);
  return rows;
};

const createScore = async (body) => {
  const [result] = await pool.query(
    'INSERT INTO scores (student_id, subject_id, score) VALUES (?, ?, ?)',
    [body.student_id, body.subject_id, body.score],
  );

  return getScoreById(result.insertId);
};

const updateScore = async (id, body) => {
  await pool.query(
    'UPDATE scores SET student_id = ?, subject_id = ?, score = ? WHERE id = ?',
    [body.student_id, body.subject_id, body.score, id],
  );

  return getScoreById(id);
};

const deleteScore = async (id) => {
  const [rows] = await pool.query('DELETE FROM scores WHERE id = ?', [id]);
  return rows;
};

const getStudentAllSubjectsWithScores = async (student_id) => {
  const [rows] = await pool.query(`
    SELECT 
    students.id AS student_id,
    students.fullname,
    subjects.id AS subject_id,
    subjects.name AS subject_name,
    scores.score
FROM scores
JOIN students ON scores.student_id = students.id
JOIN subjects ON scores.subject_id = subjects.id
WHERE students.id = ?
  `, [student_id]);

  return rows;
};

// const getClassScoreForm = async (class_id) => {
//   const [students] = await pool.query(
//     `
//     SELECT 
//       c.id AS class_id,
//       c.name AS class_name,
//       st.id AS student_id,
//       st.fullname
//     FROM classes c
//     JOIN students st ON c.id = st.class_id
//     WHERE c.id = ?
//     `,
//     [class_id]
//   );

//   const [subjects] = await pool.query(`
//     SELECT id, name
//     FROM subjects
//     ORDER BY id ASC
//   `);

//   return {
//     class: students.length
//       ? {
//           id: students[0].class_id,
//           name: students[0].class_name,
//         }
//       : null,
//     students: students.map((s) => ({
//       id: s.student_id,
//       fullname: s.fullname,
//     })),
//     subjects,
//   };
// };

module.exports = {
  getAllScores,
  getScoreById,
  checkStudentIdExist,
  checkSubjectIdExist,
  createScore,
  updateScore,
  deleteScore,
  getStudentAllSubjectsWithScores,
//   getClassScoreForm,
};
