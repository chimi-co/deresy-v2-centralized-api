const { db } = require('../firebase')
const {
  REVIEWS_COLLECTION,
  GRANTS_COLLECTION,
} = require('../constants/collections')
const grantsRef = db.collection(GRANTS_COLLECTION)
const reviewsRef = db.collection(REVIEWS_COLLECTION)

const fetchGrantByHypercertID = async hypercertID => {
  return await grantsRef.where('hypercertID', '==', hypercertID).get()
}

const fetchAllReviews = async () => {
  return await reviewsRef.get()
}

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
    const grantQuery = await fetchGrantByHypercertID(hypercertID)
    if (grantQuery.empty) return []

    const grantData = grantQuery.docs[0].data()
    const requestNames = grantData.request_names || []
    if (requestNames.length === 0) return []

    const reviewsQuery = await fetchAllReviews()
    const matchedReviews = []

    reviewsQuery.forEach(doc => {
      const reviewData = doc.data()
      const validReviews = filterValidReviews(
        reviewData,
        requestNames,
        hypercertID,
      )

      validReviews.forEach(validReview => {
        matchedReviews.push({
          attestationID: validReview.attestationID,
          pdfIpfsHash: validReview.pdfIpfsHash ? validReview.pdfIpfsHash : null,
        })
      })
    })

    return matchedReviews
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

module.exports = {
  searchReviewsByHypercertID,
}
