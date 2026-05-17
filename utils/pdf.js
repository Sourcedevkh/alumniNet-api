const pdf = require('pdfkit');

const generateCertificatePDF = (data) => {
    const doc = new pdf({ layout: 'landscape', size: 'A4' });

    // Border design
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(4).stroke('#0284c7');
    doc.rect(28, 28, doc.page.width - 56, doc.page.height - 56).lineWidth(1).stroke('#0f172a');

    // Content Layout
    doc.moveDown(4);
    doc.font('Helvetica-Bold').fontSize(40).fillColor('#0f172a').text('CERTIFICATE OF GRADUATION', { align: 'center' });
    
    doc.moveDown(1.5);
    doc.font('Helvetica').fontSize(16).fillColor('#475569').text('This is proudly presented to', { align: 'center' });
    
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(28).fillColor('#0284c7').text(data.fullname, { align: 'center' });
    
    doc.moveDown(1.5);
    const genderPronoun = data.gender === 1 ? 'she' : 'he';
    doc.font('Helvetica').fontSize(14).fillColor('#475569').text(
        `For successfully completing the program under the ${data.scholarship_name} framework,\n` +
        `attending the ${data.shift_name} session for ${data.generation_name} (${data.start_year} - ${data.end_year}).`,
        { align: 'center', lineGap: 6 }
    );

    // Footer items
    doc.moveDown(4);
    const bottomY = doc.y;
    
    doc.font('Helvetica-Bold').fontSize(12).text(`GPA: ${data.gpa} (Grade: ${data.grade})`, 80, bottomY);
    doc.font('Helvetica').fontSize(10).text(`Issued on: ${new Date(data.issued_at).toLocaleDateString()}`, 80, bottomY + 20);

    doc.font('Helvetica-Bold').fontSize(12).text('Authorized Signature', doc.page.width - 250, bottomY, { width: 170, align: 'center' });
    doc.moveTo(doc.page.width - 250, bottomY - 5)
        .lineTo(doc.page.width - 80, bottomY - 5)
        .lineWidth(1)
        .stroke('#475569');

    doc.end();
    return doc;
};

module.exports = generateCertificatePDF;