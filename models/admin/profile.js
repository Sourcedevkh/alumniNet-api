const { pool } = require('../../config/db');

const findById = async (id) => {
    let [rows] = await pool.query('SELECT id, fullname, email, gender, phone, address, role, is_active, is_verified, updated_at FROM users WHERE id = ?', [id]);
    return rows;
}

// this update query issuses
// const updateProfile = async (id, body) => {
//     let arrs = [body.fullname, body.gender, body.phone, body.address ?? null, id];
    
//     const sql = 'UPDATE users SET fullname = ?, gender = ?, phone = ?, address = ? WHERE id = ?';
//     const [result] = await pool.query(sql, arrs);

//     return result.affectedRows > 0;
// }

const updateProfile = async (id, body) => {
    let arrs = [body.fullname || null, body.gender ?? null, body.phone || null, body.address || null, id];
    const sql = `UPDATE users SET fullname = COALESCE(?, fullname), gender = COALESCE(?, gender), phone  = COALESCE(?, phone), address  = COALESCE(?, address) WHERE id = ?`;

    const [result] = await pool.query(sql, arrs);
    return result.affectedRows > 0;
}

const updateAvatar = async (id, profileUrl, cloudId) => {
    let arrs = [profileUrl, cloudId, id];
    const [result] = await pool.query('UPDATE users SET profile_url = ?, cloudinary_id = ?, updated_at = NOW() WHERE id = ?', arrs);
    return result.affectedRows > 0;
}

const deleteAvatar = async (id) => {
    const [result] = await pool.query('UPDATE users SET profile_url = NULL, cloudinary_id = NULL, updated_at = NOW() WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

module.exports = {
    findById,
    updateProfile,
    updateAvatar,
    deleteAvatar
}