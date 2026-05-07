const {pool} = require('../../config/db');

const createGeneration = async (body) => {

    const arr = [body.name, body.description, body.start_year, body.end_year];
    const [result] = await pool.query('INSERT INTO generations (name, description, start_year, end_year) VALUES (?, ?, ?, ?)', arr);

    const [rows] = await pool.query('SELECT id, name, description, start_year, end_year FROM generations WHERE id = ?', [result.insertId]);
    return rows;

}

const findGenerationByid = async (id) => {
    const [rows] = await pool.query('SELECT id, name, description, start_year, end_year FROM generations WHERE id = ?', [id]);
    return rows;
}


module.exports = {
    createGeneration,
    findGenerationByid


}