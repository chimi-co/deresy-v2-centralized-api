const { db } = require('../firebase')
const { REVIEW_REQUESTS_COLLECTION } = require('../constants/collections')

const reviewRequestsRef = db.collection(REVIEW_REQUESTS_COLLECTION)

const findReviewRequestsByHypercertID = async hypercertID => {
  let snapshot

  try {
    snapshot = await reviewRequestsRef
      .where('hypercertTargetIDs', 'array-contains', hypercertID)
      .get()

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map(doc => {
      const reviewRequest = doc.data()
      if (reviewRequest.requestName) {
        return reviewRequest.requestName
      } else {
        return null
      }
    })
  } catch (error) {
    console.error(error)
    return []
  }
}

module.exports = {
  findReviewRequestsByHypercertID,
}
