const { getIP } = require('../helpers/requestHelper');

const checkBlockedIP = async (req, res, next) => {
    try {
        const ip = getIP(req);
        req.clientIp = ip;
        next();
    } catch (error) {
        console.error('checkBlockedIP error:', error.message); 
        return res.status(500).json({
            success: false,
            message: "An error occurred while checking IP block status."
        });
    }
};

module.exports = checkBlockedIP;