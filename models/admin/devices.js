const { pool } = require('../../config/db');

const findByDeviceId = async (deviceId) => {
    const [rows] = await pool.query(
        'SELECT id FROM user_devices WHERE device_id = ?',
        [deviceId]
    );
    return rows;
};

const addDevice = async (body) => {
    const [rows] = await pool.query(
        `INSERT INTO user_devices 
        (user_id, device_id, device_name, browser_name, user_agent, last_ip, last_login_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
            body.user_id,
            body.device_id,
            body.device_name || null,
            body.browser_name || null,
            body.user_agent,
            body.ip
        ]
    );
    return rows;
};

const updateDevice = async (deviceId, ip, deviceName, browserName) => {
    const [rows] = await pool.query(
        `UPDATE user_devices 
         SET device_name = ?, browser_name = ?, last_ip = ?, last_login_at = NOW() 
         WHERE device_id = ?`,
        [deviceName || null, browserName || null, ip, deviceId]
    );
    return rows;
};

const upsertDevice = async (body) => {
    const device = await findByDeviceId(body.device_id);

    if (device.length > 0) {
        return await updateDevice(body.device_id, body.ip, body.device_name, body.browser_name);
    } else {
        return await addDevice(body);
    }
};

module.exports = {
    findByDeviceId,
    addDevice,
    updateDevice,
    upsertDevice    
};