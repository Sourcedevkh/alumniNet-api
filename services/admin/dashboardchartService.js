const dashboardChartService = require('../../models/admin/dashboardchart');

const getchartData = async () => {
    const data = await dashboardChartService.getDashboardChartData();
    return data;
}

module.exports = {
    getchartData
}