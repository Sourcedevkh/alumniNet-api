const { getIP, getUserAgent, getDeviceId } = require('../helpers/requestHelper');

const trackDevice = (req, res, next) => {
    const ip = getIP(req);
    const userAgent = getUserAgent(req);
    const deviceId = getDeviceId(userAgent, ip);

    req.device = { ip, userAgent, deviceId };
    next();
};

module.exports = trackDevice;