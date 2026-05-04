const sendResponse = (res, statusCode, success, message, data=null) =>{
    return res.status(statusCode).json({
        success,
        message,
        ...(data && {data}) // only adds key if it exists
    });
};

module.exports = {
    sendResponse
}