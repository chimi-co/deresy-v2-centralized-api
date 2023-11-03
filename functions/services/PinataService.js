const { getHypercert } = require('./DeresyDBService')

const { Readable } = require('stream')

const pinata = require('../pinata')
const { pdfGenerator } = require('./PdfService')
const { formatReviews } = require('../utils')

const prepareReviewForm = ({ easSchemaID, questions, questionOptions }) => ({
  choices: questionOptions,
  easSchemaID,
  questions,
})

const prepareReview = ({
  name,
  answers,
  hypercertID,
  accountID,
  amendments,
  reviewCreatedAt,
  attachmentsIpfsHashes,
  tokenID,
  attestationID,
}) => ({
  name,
  answers,
  hypercertID,
  reviewer: accountID,
  amendments,
  createdAt: reviewCreatedAt,
  attachmentsIpfsHashes,
  tokenID,
  attestationID,
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
  const hypercertDetails = await getHypercert(pdfData.tokenID)
  const summary =
    hypercertDetails && hypercertDetails.metadata
      ? hypercertDetails.metadata.description
      : ''

  const formattedReview = formatReviews(reviewForm, { ...review, summary })
  const pdf = await pdfGenerator(formattedReview)
  const stream = Readable.from(pdf)

  stream.push(pdf)
  stream.push(null)

  return await pinata.pinFileToIPFS(stream, pinataOptions)
}

const uploadFileToIpfs = async fileBuffer => {
  const options = {
    pinataMetadata: {
      name: 'UPLOAD-FILE',
    },
  }

  const result = await pinata.pinFileToIPFS(fileBuffer, options)
  return result.IpfsHash
}

module.exports = {
  uploadPdf,
  uploadFileToIpfs,
}
