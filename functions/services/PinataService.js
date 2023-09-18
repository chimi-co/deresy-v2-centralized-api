const { getGrantById } = require('./DeresyDBService')

const { Readable } = require('stream')

const pinata = require('../pinata')
const { pdfGenerator } = require('./PdfService')
const { formatReviews } = require('../utils')

const prepareReviewForm = ({ easSchemaID, questions, questionOptions }) => ({
  choices: questionOptions,
  easSchemaID,
  questions,
})

const prepareReview = ({ name, answers, hypercertID, accountID }) => ({
  name,
  answers,
  hypercertID,
  reviewer: accountID,
})

const getPinataOptions = ({ hypercertID, accountID }) => ({
  pinataMetadata: {
    name: `review-${hypercertID}-${accountID}`,
  },
})

const uploadPdf = async (pdfData = {}) => {
  const pinataOptions = getPinataOptions(pdfData)
  const reviewForm = prepareReviewForm(pdfData)
  const review = prepareReview(pdfData)
  const grantDetails = await getGrantById(pdfData.grantID)
  const summary = grantDetails ? grantDetails.summary : ''

  const formattedReview = formatReviews(reviewForm, { ...review, summary })
  const pdf = await pdfGenerator(formattedReview)
  const stream = Readable.from(pdf)

  stream.push(pdf)
  stream.push(null)

  return await pinata.pinFileToIPFS(stream, pinataOptions)
}

module.exports = {
  uploadPdf,
}
