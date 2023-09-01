const getStream = require('get-stream')
const { Readable } = require('stream')

const pinata = require('../pinata')
const { pdfGenerator } = require('./PdfService')
const { formatReviews } = require('../utils')

// Hardcoded REVIEWS payload
const REVIEWS = {
  requestName: 'TestRequest',
  reviews: [
    {
      answers: ['Carlos', 'Other', 'High', 'no comments'],
      attestationID:
        '0x3b8a1ba1dfc0a4e7874679a9ded1952e106b0b8c151667c6445344cf740987b9',
      hypercertID: '1000',
      reviewer: '0xbA373b2CF4B25336c8e45431825dd3AEAFBf342d',
    },
    {
      answers: ['Jimmy', 'Other', 'High', 'no'],
      attestationID:
        '0x0f362c6b3b2739650d550f3eb0d490195d7268fbbbe889693a55f6e558018c00',
      hypercertID: '1002',
      reviewer: '0xbA373b2CF4B25336c8e45431825dd3AEAFBf342d',
    },
  ],
}

// Hardcoded REVIEW_FORM payload
const REVIEW_FORM = {
  choices: [
    {
      choices: [],
    },
    {
      choices: ['USA', 'Canada', 'Mexico', 'Other'],
    },
    {
      choices: ['Low', 'Medium', 'High'],
    },
    {
      choices: [],
    },
  ],
  easSchemaID:
    '0xba658d50fafb942a10ac13b01782cec372755b409c88819780691d5d369e5885',
  formID: 1,
  questions: ['Name', 'Location', 'Level', 'Comments'],
  tx: '0xf4120ddc23dde778bbe9708cea3f2aafe10ef14806c21f638f5012f1d45d9c6f',
  types: ['0', '2', '2', '0'],
}

const uploadPdf = async () => {
  const pinataOptions = {
    pinataMetadata: {
      name: 'Review', // name of file to upload
    },
  }

  const review = formatReviews(REVIEW_FORM, REVIEWS.reviews[0])

  const pdf = await pdfGenerator(review)
  const pdfBuffer = await getStream.buffer(pdf)

  const stream = new Readable()
  stream.push(pdfBuffer)
  stream.push(null)

  return await pinata.pinFileToIPFS(stream, pinataOptions)
}

module.exports = {
  uploadPdf,
}
