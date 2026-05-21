const chartService = require('../../services/admin/dashboardchartService');
const { sendResponse } = require('../../utils/responseHelper');

const getchartData = async (req, res) => {
    try {
        const result = await chartService.getchartData();
        return sendResponse(res, 200, true, 'Chart data retrieved successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }   
}

module.exports = {
    getchartData
}

