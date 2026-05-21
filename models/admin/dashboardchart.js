const {pool} = require('../../config/db');

const getDashboardChartData = async () => {
    const [rows] = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM students) AS total_students,
            (SELECT COUNT(*) FROM classes) AS total_classes,
            (SELECT COUNT(*) FROM generations) AS total_generations,
            (SELECT COUNT(*) FROM scholarships) AS total_scholarships
    `);

    return rows[0];
};

module.exports = {
    getDashboardChartData
};