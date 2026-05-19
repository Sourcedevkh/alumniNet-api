'use strict';

/**
 * utils/pdf.js
 * Certificate PDF — matches Certi-ai.png design exactly.
 * White background, navy/gold corners, arc watermark top-right,
 * Medal.png badge centre-bottom with grade + GPA overlay.
 *
 * npm install pdfkit
 */

const PDFDocument = require('pdfkit');
const path        = require('path');
const fs          = require('fs');

// ─── Medal image — place Medal.png in your project root ───────────────────────
const MEDAL_PATH = path.join(__dirname, '..', 'Medal.png');

// ─── Colour palette (matches Certi-ai.png exactly) ────────────────────────────
const NAVY       = '#1B3A6B';   // corner triangles, borders
const GOLD       = '#C8960C';   // corner gold stripe
const BLUE_TITLE = '#1A56DB';   // "OF ACHIEVEMENT" + student name
const BLACK      = '#111111';   // "CERTIFICATE" title, org name
const GREY_BODY  = '#4A4A4A';   // body description text
const GREY_LABEL = '#888888';   // DATE / SIGNATURE labels
const DIVIDER    = '#B8CCE8';   // horizontal divider line
const WATERMARK  = '#C5D5E8';   // arc lines colour

// ─── A4 Landscape ─────────────────────────────────────────────────────────────
const W = 841.89;
const H = 595.28;

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
const generateCertificatePDF = (certData) => {
    const doc = new PDFDocument({
        size   : [W, H],
        margin : 0,
        info   : {
            Title  : `Certificate – ${certData.fullname}`,
            Author : 'ANT Technology Training Center',
        },
    });

    _drawBackground(doc);
    _drawWatermarkArcs(doc);
    _drawBorder(doc);
    _drawCorners(doc);
    _drawContent(doc, certData);

    doc.end();
    return doc;
};

module.exports = generateCertificatePDF;

// ═══════════════════════════════════════════════════════════════════════════════
//  BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════
function _drawBackground(doc) {
    // White base
    doc.rect(0, 0, W, H).fill('#FFFFFF');

    // Very subtle light blue tint in top-right area (matches the original)
    doc.save().fillOpacity(0.04);
    doc.rect(W / 2, 0, W / 2, H / 2).fill('#BDD0F0');
    doc.restore();
}

// ─── Curved arc watermark lines — top-right corner ────────────────────────────
function _drawWatermarkArcs(doc) {
    // The arcs fan out from near the top-right corner, matching Certi-ai.png
    doc.save().strokeOpacity(0.18);
    const originX = W + 20;
    const originY = -20;
    for (let r = 160; r <= 520; r += 30) {
        doc.circle(originX, originY, r)
           .lineWidth(0.7)
           .strokeColor(WATERMARK)
           .stroke();
    }
    doc.restore();

    // Bottom-left faint arcs (subtle, matching original)
    doc.save().strokeOpacity(0.1);
    for (let r = 120; r <= 340; r += 30) {
        doc.circle(-20, H + 20, r)
           .lineWidth(0.5)
           .strokeColor(WATERMARK)
           .stroke();
    }
    doc.restore();
}

// ─── Double border ────────────────────────────────────────────────────────────
function _drawBorder(doc) {
    // Outer navy border
    doc.rect(16, 16, W - 32, H - 32)
       .lineWidth(2.5)
       .strokeColor(NAVY)
       .stroke();

    // Inner thin blue border
    doc.rect(24, 24, W - 48, H - 48)
       .lineWidth(0.7)
       .strokeColor('#7A9FD0')
       .stroke();
}

// ─── Navy triangle corners + gold stripe ─────────────────────────────────────
function _drawCorners(doc) {
    const S = 120;   // triangle leg length
    const G = 22;    // gold stripe thickness

    // ── TOP-LEFT ──────────────────────────────────────────────────────────────
    // Navy filled triangle
    doc.polygon([0, 0], [S, 0], [0, S]).fill(NAVY);
    // Gold diagonal stripe near the hypotenuse
    doc.polygon([S - G, 0], [S, 0], [0, S], [0, S - G]).fill(GOLD);

    // ── BOTTOM-RIGHT ──────────────────────────────────────────────────────────
    doc.polygon([W, H], [W - S, H], [W, H - S]).fill(NAVY);
    doc.polygon([W - S + G, H], [W - S, H], [W, H - S], [W, H - S + G]).fill(GOLD);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CONTENT
// ═══════════════════════════════════════════════════════════════════════════════
function _drawContent(doc, certData) {
    const TX = 80;            // left padding (avoids corner triangle)
    const TW = W - 160;       // text width
    const cx = W / 2;         // horizontal centre

    // ── "CERTIFICATE" ─────────────────────────────────────────────────────────
    // Matches the original: large, bold, serif-style (Helvetica-Bold is closest
    // available built-in; for a true serif use an embedded font)
    doc.font('Helvetica-Bold')
       .fontSize(62)
       .fillColor(BLACK)
       .text('CERTIFICATE', TX, 52, { width: TW, align: 'center' });

    // ── "OF ACHIEVEMENT" ──────────────────────────────────────────────────────
    doc.font('Helvetica')
       .fontSize(13)
       .fillColor(BLUE_TITLE)
       .text('OF ACHIEVEMENT', TX, 128, {
           width: TW, align: 'center', characterSpacing: 3,
       });

    // ── Organisation ──────────────────────────────────────────────────────────
    doc.font('Helvetica-Bold')
       .fontSize(14)
       .fillColor(BLACK)
       .text('ANT Technology Training Center', TX, 162, {
           width: TW, align: 'center',
       });

    // ── Student name ──────────────────────────────────────────────────────────
    doc.font('Helvetica-Bold')
       .fontSize(38)
       .fillColor(BLUE_TITLE)
       .text(certData.fullname || '—', TX, 194, {
           width: TW, align: 'center',
       });

    // ── Horizontal divider (matches the original full-width blue line) ─────────
    const divY = 252;
    doc.moveTo(cx - 310, divY).lineTo(cx + 310, divY)
       .lineWidth(0.8).strokeColor(DIVIDER).stroke();

    // ── Body description ───────────────────────────────────────────────────────
    const shift      = certData.shift_name      || '';
    const generation = certData.generation_name || '';
    const years      = (certData.start_year && certData.end_year)
        ? ` (${certData.start_year} – ${certData.end_year})`
        : '';

    const body = (shift && generation)
        ? `For successfully completing the program under the\nSoftware Development framework, attending the ${shift} session for ${generation}${years}.`
        : 'For successfully completing the program under the\nSoftware Development framework.';

    doc.font('Helvetica')
       .fontSize(13)
       .fillColor(GREY_BODY)
       .text(body, TX, 268, { width: TW, align: 'center', lineGap: 5 });

    // ── Medal image (centre-bottom) ────────────────────────────────────────────
    const medalSize = 100;
    const medalY    = 358;
    _drawMedal(doc, cx, medalY, medalSize, certData.grade || 'A', certData.gpa);

    // ── Date / Signature row ───────────────────────────────────────────────────
    const rowY  = 460;
    const colW  = 150;
    const dateX = cx - 185;
    const sigX  = cx + 185;

    const issued = certData.issued_at
        ? new Date(certData.issued_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric' });

    // DATE column
    doc.font('Helvetica-Bold').fontSize(11).fillColor(BLACK)
       .text(issued, dateX - colW / 2, rowY, { width: colW, align: 'center' });
    doc.moveTo(dateX - colW / 2, rowY + 18).lineTo(dateX + colW / 2, rowY + 18)
       .lineWidth(0.7).strokeColor(BLACK).stroke();
    doc.font('Helvetica').fontSize(8).fillColor(GREY_LABEL)
       .text('DATE', dateX - colW / 2, rowY + 23, {
           width: colW, align: 'center', characterSpacing: 2 });

    // SIGNATURE column
    doc.font('Helvetica-Bold').fontSize(11).fillColor(BLACK)
       .text('Awarder', sigX - colW / 2, rowY, { width: colW, align: 'center' });
    doc.moveTo(sigX - colW / 2, rowY + 18).lineTo(sigX + colW / 2, rowY + 18)
       .lineWidth(0.7).strokeColor(BLACK).stroke();
    doc.font('Helvetica').fontSize(8).fillColor(GREY_LABEL)
       .text('SIGNATURE', sigX - colW / 2, rowY + 23, {
           width: colW, align: 'center', characterSpacing: 2 });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MEDAL
// ═══════════════════════════════════════════════════════════════════════════════
function _drawMedal(doc, cx, topY, size, grade, gpa) {
    const hasGpa = gpa != null && gpa !== '';

    if (fs.existsSync(MEDAL_PATH)) {
        // ── Render Medal.png centred ───────────────────────────────────────────
        doc.image(MEDAL_PATH, cx - size / 2, topY, {
            width  : size,
            height : size,
        });

        // ── Grade letter overlaid on medal ─────────────────────────────────────
        // Position tuned to sit on the gold circle portion of the medal image
        const gradeY = hasGpa
            ? topY + size * 0.20
            : topY + size * 0.28;

        doc.font('Helvetica-Bold')
           .fontSize(28)
           .fillColor('#111111')
           .text(String(grade), cx - size / 2, gradeY, {
               width: size, align: 'center',
           });

        // ── GPA below grade ───────────────────────────────────────────────────
        if (hasGpa) {
            doc.font('Helvetica-Bold')
               .fontSize(9)
               .fillColor('#222222')
               .text(`GPA: ${gpa}`, cx - size / 2, topY + size * 0.56, {
                   width: size, align: 'center',
               });
        }
    } else {
        // ── Fallback: draw badge programmatically ──────────────────────────────
        const cy = topY + size / 2;
        const R  = size / 2 - 4;
        const PTS = 16;
        const pts = [];
        for (let i = 0; i < PTS * 2; i++) {
            const angle = (Math.PI / PTS) * i - Math.PI / 2;
            const r     = i % 2 === 0 ? R + 14 : R + 4;
            pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
        }
        doc.polygon(...pts).fill(NAVY);
        doc.circle(cx, cy, R).fill('#D4A017');

        const letterY = hasGpa ? cy - R + 5 : cy - 15;
        doc.font('Helvetica-Bold').fontSize(26).fillColor('#111111')
           .text(String(grade), cx - R, letterY, { width: R * 2, align: 'center' });
        if (hasGpa) {
            doc.font('Helvetica-Bold').fontSize(9).fillColor('#222222')
               .text(`GPA: ${gpa}`, cx - R, cy + 10, { width: R * 2, align: 'center' });
        }
    }
}