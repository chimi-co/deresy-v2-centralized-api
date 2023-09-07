const puppeteer = require('puppeteer')
const { reviewToHtml } = require('../utils')

const pdfGenerator = async review => {
  const browser = await puppeteer.launch({
    args: minimal_args,
    headless: true,
  })
  const page = await browser.newPage()
  const htmlContent = reviewToHtml(review)

  await page.setContent(htmlContent)
  const pdfBuffer = await page.pdf({ format: 'A4' })

  await browser.close()
  return pdfBuffer
}

const testPdfGenerator = async review => {
  const browser = await puppeteer.launch({
    args: minimal_args,
    headless: true,
  })
  const page = await browser.newPage()
  const htmlContent = "<p>HI!</p><p>Just testing</p>"

  await page.setContent(htmlContent)
  const pdfBuffer = await page.pdf({ format: 'A4' })

  await browser.close()
  return pdfBuffer
}

const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
]

module.exports = {
  testPdfGenerator,
  pdfGenerator,
}
