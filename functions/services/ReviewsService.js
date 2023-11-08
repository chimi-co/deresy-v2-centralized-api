const { db } = require('../firebase')
const { REVIEWS_COLLECTION } = require('../constants/collections')
const { amendmentsByAttestationId } = require('./AmendmentsService')
const { findReviewRequestsByHypercertID } = require('./ReviewRequestsService')
const reviewsRef = db.collection(REVIEWS_COLLECTION)

const filterValidReviews = (reviewData, requestNames, hypercertID) => {
  if (requestNames.includes(reviewData.requestName)) {
    return reviewData.reviews.filter(
      review => review.hypercertID === hypercertID,
    )
  }
  return []
}

const searchReviewsByHypercertID = async hypercertID => {
  try {
    const requestNames = await findReviewRequestsByHypercertID(hypercertID)
    const reviewsQuery = await reviewsRef.get()
    const reviewDocs = reviewsQuery.docs

    const matchedReviewsPromises = reviewDocs.map(async doc => {
      const reviewData = doc.data()
      const validReviews = filterValidReviews(
        reviewData,
        requestNames,
        hypercertID,
      )

      return Promise.all(
        validReviews.map(async validReview => {
          const amendments = await amendmentsByAttestationId(
            validReview.attestationID,
          )
          return {
            attestationID: validReview.attestationID,
            createdAt: validReview.createdAt,
            pdfIpfsHash: validReview.pdfIpfsHash
              ? validReview.pdfIpfsHash
              : null,
            attachmentsIpfsHashes: validReview.attachmentsIpfsHashes
              ? validReview.attachmentsIpfsHashes
              : null,
            amendments: amendments,
          }
        }),
      )
    })

    const allMatchedReviews = await Promise.all(matchedReviewsPromises)
    return allMatchedReviews.flat().sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

module.exports = {
  searchReviewsByHypercertID,
}
