const crypto = require('crypto');
const UAParser = require('ua-parser-js');

const getIP = (req) => {
    return (
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        req.ip ||
        'unknown'
    );
};

const getUserAgent = (req) => {
    return req.headers['user-agent'] || 'unknown';
};

const getDeviceId = (userAgent, ip) => {
    return crypto
        .createHash('sha256')
        .update(userAgent + ip)
        .digest('hex');
};

const getDeviceInfo = (userAgent) => {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
        browser_name: result.browser.name || 'Unknown',
        device_name: result.device.type  || 'Desktop',
        os_name:     result.os.name      || 'Unknown'
    };
};

module.exports = { getIP, getUserAgent, getDeviceId, getDeviceInfo };