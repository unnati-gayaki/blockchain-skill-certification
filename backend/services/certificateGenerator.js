const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

exports.generateCertificatePDF = async ({
  certId,
  studentName,
  courseName,
  aiMatch,
  aiConfidence
}) => {
  const certDir = path.join(__dirname, "../certificates");

  // create folder if not exists
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir);
  }

  const filePath = path.join(certDir, `${certId}.pdf`);

  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4" });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(22).text("Blockchain Verified Certificate", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(14).text(`Certificate ID: ${certId}`);
    doc.text(`Student Name: ${studentName}`);
    doc.text(`Course: ${courseName}`);
    doc.text(`AI Confidence: ${aiConfidence}%`);
    doc.text(`Status: ${aiMatch ? "VALID CERTIFICATE" : "SKILL MISMATCH"}`);

    doc.moveDown(2);
    doc.text("This certificate is stored on blockchain and is verifiable via QR code.");

    doc.end();

    stream.on("finish", () => resolve(filePath));
  });
};
