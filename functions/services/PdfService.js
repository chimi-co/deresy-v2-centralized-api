const PdfKit = require('pdfkit')

const pdfGenerator = async review => {
  const doc = new PdfKit()

  const {
    attestationID,
    easSchemaID,
    hypercertID,
    name,
    summary,
    reviewer,
    questions,
  } = review

  doc.fontSize(20).text(name)
  doc.moveDown()
  doc.fontSize(14).text('Summary')
  doc.moveDown()
  doc.fontSize(12).text(summary)
  doc.moveDown()
  doc.fontSize(12).text(`Reviewer: ${reviewer}`)
  doc.moveDown()
  doc.fontSize(12).text(`Hypercert ID: ${hypercertID}`)
  doc.moveDown()

  doc.fontSize(12).text('EAS Schema ID:', { continued: true })
  doc
    .fontSize(12)
    .fillColor('blue')
    .text(easSchemaID, {
      link: `https://optimism-goerli-bedrock.easscan.org/schema/view/${easSchemaID}`,
    })
  doc.moveDown().fillColor('black')

  doc.moveDown()
  doc.fontSize(14).text('Questions')
  doc.moveDown()
  questions.forEach(({ answer, question }, index) => {
    doc.fontSize(12).text(`${index + 1}. ${question}`)
    doc.moveDown()
    doc.fontSize(12).text(`    ${answer}`)
    doc.moveDown()
  })
  doc.end()
  return doc
}

module.exports = {
  pdfGenerator,
}
