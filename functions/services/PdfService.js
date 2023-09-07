const puppeteer = require('puppeteer')
const { reviewToHtml } = require('../utils')

const pdfGenerator = async review => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const htmlContent = await reviewToHtml(review)

  await page.setContent(htmlContent)
  const pdfBuffer = await page.pdf({ format: 'A4' })

  console.log('hola')
  console.log(pdfBuffer)

  await browser.close()
  return pdfBuffer
}

module.exports = {
  pdfGenerator,
}
