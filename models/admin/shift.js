const { pool } = require('../../config/db');

const getShift = async () => {
    const [rows] = await pool.query('SELECT * FROM shifts');
    return rows;
}

const getShiftId = async (id) => {
    const [rows] = await  pool.query('SELECT * FROM shifts WHERE id = ?', [id]);
    return rows[0];
}

const getShiftByName = async (name) => {
    const [rows] = await pool.query('SELECT * FROM shifts WHERE name = ?', [name]);
    return rows[0];
}

const create = async  (body) => {
    let arrs = [body.name];
    let [result] = await  pool.query('INSERT INTO shifts (name) VALUES (?)', arrs);
    return result.insertId;
}

const update = async (id, body) => {
    const values = [body.name, id];
    const [result] = await pool.query('UPDATE shifts SET name = ? WHERE id = ?', values);
    return result.affectedRows;
}

const remove = async (id) => {
    const [result] = await pool.query('DELETE FROM shifts WHERE id = ?', [id]);
    return result.affectedRows;
}

module.exports = {
    getShift,
    create,
    getShiftId,
    getShiftByName,
    update,
    remove
}