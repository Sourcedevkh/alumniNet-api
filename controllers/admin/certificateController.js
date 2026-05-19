const certificateService = require('../../services/admin/certificateService');
const { sendResponse } = require('../../utils/responseHelper');
const getCertificateSuccessHtml = require('../../utils/certificateSuccessHtml');

const downloadCerti = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { pdfBuffer, fullname } = await certificateService.getCertiByStudentId(studentId);

        // Create a safe, spaces-removed filename
        const safeFilename = `Certificate_${fullname.replace(/\s+/g, '_')}.pdf`;

        // HTTP Headers to trigger an instant browser download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        return res.send(pdfBuffer);

    } catch (error) {
        console.error('Error in downloadCerti controller:', error);

        if (!res.headersSent) {
            const isDataMissing = error.message.includes('not found');

            return res.status(isDataMissing ? 404 : 500).json({
                success: false,
                message: error.message || 'Internal processing error occurred'
            });
        }
    }
};

module.exports = {
    downloadCerti
};