'use strict';

const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const MEDAL_PATH = path.join(__dirname, '..', 'Medal.png');
const DEFAULT_LOGO_PATHS = [
    path.join(__dirname, '..', 'public', 'images', 'ANT logo HD.png'),
    path.join(__dirname, '..', 'public', 'images', 'CBRD Fund Logo Final.png'),
    path.join(__dirname, '..', 'public', 'images', 'Logo_MPTC.png'),
];

const COLORS = {
    navy: '#1E3A8A',
    gold: '#D4A017',
    lightGold: '#F5D67B',
    blue: '#355C9A',
    black: '#111827',
    gray: '#6B7280',
    border: '#C7D2FE',
    light: '#F8FAFC',
    watermark: '#CBD5E1',
};

const W = 841.89;
const H = 595.28;


const generateCertificatePDF = (certData) => {

    const doc = new PDFDocument({
        size: [W, H],
        margin: 0,
    });

    drawBackground(doc);
    drawDecorations(doc);
    drawBorders(doc);
    drawContent(doc, certData);

    doc.end();
    return doc;
};

module.exports = generateCertificatePDF;

function drawBackground(doc) {

    doc.rect(0, 0, W, H)
        .fill('#FFFFFF');

    doc.save();
    doc.fillOpacity(0.03);

    doc.polygon(
        [W * 0.5, 0],
        [W, 0],
        [W, H * 0.5]
    ).fill(COLORS.blue);

    doc.restore();
}

function drawDecorations(doc) {


    doc.polygon(
        [0, 0],
        [120, 0],
        [0, 120]
    ).fill(COLORS.navy);

    doc.polygon(
        [92, 0],
        [104, 0],
        [0, 104],
        [0, 92]
    ).fill(COLORS.gold);


    doc.polygon(
        [W, H],
        [W - 120, H],
        [W, H - 120]
    ).fill(COLORS.navy);

    doc.polygon(
        [W - 92, H],
        [W - 104, H],
        [W, H - 104],
        [W, H - 92]
    ).fill(COLORS.gold);

    doc.save();
    doc.strokeOpacity(0.15);

    for (let i = 180; i <= 520; i += 25) {

        doc.circle(W + 20, -20, i)
            .lineWidth(0.7)
            .strokeColor(COLORS.watermark)
            .stroke();
    }

    doc.restore();

    doc.save();
    doc.strokeOpacity(0.08);

    for (let i = 100; i <= 320; i += 25) {

        doc.circle(-20, H + 20, i)
            .lineWidth(0.5)
            .strokeColor(COLORS.watermark)
            .stroke();
    }

    doc.restore();
}

function drawBorders(doc) {

    doc.rect(18, 18, W - 36, H - 36)
        .lineWidth(2)
        .strokeColor(COLORS.border)
        .stroke();

    doc.rect(28, 28, W - 56, H - 56)
        .lineWidth(0.7)
        .strokeColor('#E2E8F0')
        .stroke();
}

function drawContent(doc, certData) {

    const centerX = W / 2;

    const logoPaths = certData.logoPath
        ? Array.isArray(certData.logoPath)
            ? certData.logoPath.map((name) => path.join(__dirname, '..', 'public', 'images', name))
            : [path.join(__dirname, '..', 'public', 'images', certData.logoPath)]
        : DEFAULT_LOGO_PATHS;

    drawCertificateLogos(doc, centerX, logoPaths);

    doc.font('Times-Bold')
        .fontSize(58)
        .fillColor(COLORS.black)
        .text('CERTIFICATE', 0, 100, {
            align: 'center',
        });

    doc.font('Helvetica')
        .fontSize(16)
        .fillColor(COLORS.blue)
        .text('OF ACHIEVEMENT', 0, 165, {
            align: 'center',
            characterSpacing: 4,
        });

  
    doc.font('Helvetica-Bold')
        .fontSize(20)
        .fillColor(COLORS.black)
        .text(
            certData.organization || 'ANT Technology Training Center',
            0,
            205,
            { align: 'center' }
        );

  
    doc.font('Helvetica-Bold')
        .fontSize(36)
        .fillColor(COLORS.blue)
        .text(
            certData.fullname || 'Student Name',
            0,
            255,
            { align: 'center' }
        );


    doc.moveTo(150, 325)
        .lineTo(W - 150, 325)
        .lineWidth(1)
        .strokeColor('#CBD5E1')
        .stroke();

    const scholarshipType = certData.scholarship_name ? `${certData.scholarship_name} Scholarship` : 'program';

    doc.font('Helvetica')
        .fontSize(18)
        .fillColor(COLORS.gray)
        .text(`For successfully completing the ${scholarshipType}.`, 120, 350, {
            align: 'center',
            width: W - 240,
            lineGap: 6,
        });

    const grade = resolveGrade(certData);
  
    drawMedal(
        doc,
        centerX,
        455,
        120,
        grade
    );

    drawFooter(doc, certData);
}

function drawMedal(doc, cx, cy, size, grade) {

    const r = size / 2;


    doc.polygon(
        [cx - 20, cy + 30],
        [cx - 55, cy + 90],
        [cx - 10, cy + 80]
    ).fill(COLORS.navy);


    doc.polygon(
        [cx + 20, cy + 30],
        [cx + 55, cy + 90],
        [cx + 10, cy + 80]
    ).fill(COLORS.navy);


    const points = [];

    for (let i = 0; i < 32; i++) {

        const angle = (Math.PI / 16) * i;
        const radius = i % 2 === 0 ? r : r - 10;

        points.push([
            cx + Math.cos(angle) * radius,
            cy + Math.sin(angle) * radius,
        ]);
    }

    doc.polygon(...points)
        .fill(COLORS.navy);


    doc.circle(cx, cy, r - 12)
        .fill(COLORS.gold);


    doc.circle(cx, cy, r - 18)
        .lineWidth(2)
        .strokeColor(COLORS.lightGold)
        .stroke();


    doc.font('Helvetica-Bold')
        .fontSize(42)
        .fillColor(COLORS.black)
        .text(
            grade,
            cx - 30,
            cy - 15,
            {
                width: 60,
                align: 'center',
            }
        );
}

function drawCertificateLogos(doc, centerX, logoPaths) {
    const defaultLogoWidth = 90;
    const largerLogoWidth = 180;
    const gap = 40;
    const widths = logoPaths.map((logoPath) => {
        const basename = path.basename(logoPath).toLowerCase();
        if (basename === 'logo_mptc.png') {
            return largerLogoWidth;
        }
        return defaultLogoWidth;
    });
    const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * (logoPaths.length - 1);
    let x = centerX - totalWidth / 2;
    const y = 20;

    for (let i = 0; i < logoPaths.length; i++) {
        const logoPath = logoPaths[i];
        const logoWidth = widths[i];

        if (!fs.existsSync(logoPath)) {
            x += logoWidth + gap;
            continue;
        }

        try {
            doc.image(logoPath, x, y, {
                width: logoWidth,
            });
        } catch (error) {
            x += logoWidth + gap;
            continue;
        }

        x += logoWidth + gap;
    }
}

function resolveGrade(certData) {
    if (certData.grade) {
        return certData.grade;
    }

    const gpa = parseFloat(certData.gpa);
    if (Number.isFinite(gpa)) {
        if (gpa >= 3.7) return 'A';
        if (gpa >= 3.0) return 'B';
        if (gpa >= 2.0) return 'C';
        if (gpa >= 1.0) return 'D';
        return 'F';
    }

    return 'N/A';
}

function drawGpaBelowMedal(doc, cx, y, gpa) {
    doc.font('Helvetica')
        .fontSize(16)
        .fillColor(COLORS.black)
        .text(
            `GPA: ${gpa}`,
            cx - 60,
            y,
            {
                width: 120,
                align: 'center',
            }
        );
}

function drawFooter(doc, certData) {

    const date = certData.issued_at
        ? new Date(certData.issued_at)
        : new Date();

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    doc.font('Helvetica')
        .fontSize(16)
        .fillColor(COLORS.black)
        .text(formattedDate, 130, 510, {
            width: 180,
            align: 'center',
        });

    doc.moveTo(120, 540)
        .lineTo(330, 540)
        .lineWidth(1)
        .strokeColor('#94A3B8')
        .stroke();

    doc.font('Helvetica')
        .fontSize(10)
        .fillColor(COLORS.gray)
        .text('DATE', 120, 548, {
            width: 210,
            align: 'center',
            characterSpacing: 2,
        });

    const awarder = certData.awarder || certData.signatory || 'Awarder';

    doc.font('Helvetica')
        .fontSize(16)
        .fillColor(COLORS.black)
        .text(awarder, W - 310, 510, {
            width: 180,
            align: 'center',
        });

    doc.moveTo(W - 330, 540)
        .lineTo(W - 120, 540)
        .lineWidth(1)
        .strokeColor('#94A3B8')
        .stroke();

    doc.font('Helvetica')
        .fontSize(10)
        .fillColor(COLORS.gray)
        .text('SIGNATURE', W - 330, 548, {
            width: 210,
            align: 'center',
            characterSpacing: 2,
        });
}