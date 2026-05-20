const { pool } = require('../../config/db');

const getAllSubjects = async () => {
  const [rows] = await pool.query(
    'SELECT id, name, description, created_at, updated_at FROM subjects ORDER BY id DESC'
  );
  return rows;
};

const getSubjectById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, description, created_at, updated_at FROM subjects WHERE id = ?',
    [id]
  );
  return rows;
};

const findSubjectByName = async (name) => {
  const [rows] = await pool.query('SELECT id FROM subjects WHERE name = ?', [name]);
  return rows;
};

const checkSubjectIdExist = async (id) => {
  const [rows] = await pool.query('SELECT id FROM subjects WHERE id = ?', [id]);
  return rows;
};

const createSubject = async (body) => {
  const [result] = await pool.query(
    'INSERT INTO subjects (name, description) VALUES (?, ?)',
    [body.name, body.description || null]
  );

  return getSubjectById(result.insertId);
};

const updateSubject = async (id, body) => {
  await pool.query(
    'UPDATE subjects SET name = ?, description = ? WHERE id = ?',
    [body.name, body.description, id]
  );

  const [rows] = await pool.query(
    'SELECT id, name, description, created_at, updated_at FROM subjects WHERE id = ?',
    [id]
  );

  return rows[0];
};

const deleteSubject = async (id) => {
  const [rows] = await pool.query('DELETE FROM subjects WHERE id = ?', [id]);
  return rows;
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  findSubjectByName,
  checkSubjectIdExist,
  createSubject,
  updateSubject,
  deleteSubject,
};
