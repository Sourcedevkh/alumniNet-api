const express = require('express');
const router = express.Router();

const chart = require('../../controllers/admin/dashboardchart');
const { isLogin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

router.get('/data', isLogin, chart.getchartData);

module.exports = router;