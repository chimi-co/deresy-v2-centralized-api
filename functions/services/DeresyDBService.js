const { db } = require('../firebase')

const {
  FORMS_COLLECTION,
  REVIEW_REQUESTS_COLLECTION,
  REVIEWS_COLLECTION,
  GRANTS_COLLECTION,
  AMENDMENTS_COLLECTION,
  HYPERCERTS_COLLECTION,
} = require('../constants/collections')
const { functions } = require('lodash')
const formsRef = db.collection(FORMS_COLLECTION)
const reviewRequestsRef = db.collection(REVIEW_REQUESTS_COLLECTION)
const reviewsRef = db.collection(REVIEWS_COLLECTION)
const amendmentsRef = db.collection(AMENDMENTS_COLLECTION)
const grantsRef = db.collection(GRANTS_COLLECTION)
const hypercertsRef = db.collection(HYPERCERTS_COLLECTION)

const saveForm = async (formName, data) => {
  const snapshot = await formsRef
    .where('formName', '==', formName)
    .limit(1)
    .get()

  if (snapshot.empty) {
    await formsRef.add({
      ...data,
    })
  } else {
    const document = formsRef.doc(snapshot.docs[0].id)
    await document.update({
      ...data,
    })
  }
}

const saveRequest = async (requestName, data) => {
  const snapshot = await reviewRequestsRef
    .where('requestName', '==', requestName)
    .limit(1)
    .get()

  if (snapshot.empty) {
    await reviewRequestsRef.add({
      ...data,
    })
  } else {
    const document = reviewRequestsRef.doc(snapshot.docs[0].id)
    await document.update({
      ...data,
    })
  }
}

const saveReviews = async (requestName, data) => {
  const snapshot = await reviewsRef
    .where('requestName', '==', requestName)
    .limit(1)
    .get()

  if (snapshot.empty) {
    await reviewsRef.add({
      ...data,
    })
  } else {
    const document = reviewsRef.doc(snapshot.docs[0].id)
    await document.update({
      ...data,
    })
  }
}

const saveAmendment = async data => {
  const snapshot = await amendmentsRef
    .where('uid', '==', data.amendmentUID)
    .limit(1)
    .get()

  if (snapshot.empty) {
    await amendmentsRef.add({
      ...data,
    })
  } else {
    const document = amendmentsRef.doc(snapshot.docs[0].id)
    await document.update({
      ...data,
    })
  }
}

const updateGrant = async (id, payload) => {
  await grantsRef.doc(id).update({ ...payload })
}

const getGrantByTarget = async requestTarget => {
  const snapshot = await grantsRef
    .where('request_target', '==', requestTarget)
    .limit(1)
    .get()

  return { documentId: snapshot.docs[0].id, ...snapshot.docs[0].data() }
}

const getReviewRequest = async requestName => {
  const snapshot = await reviewRequestsRef
    .where('requestName', '==', requestName)
    .where(
      'systemVersion',
      '==',
      parseInt(functions.config().settings.systemVersion),
    )
    .limit(1)
    .get()
  return snapshot.docs[0].data()
}

const getReviews = async requestName => {
  const snapshot = await reviewsRef
    .where('requestName', '==', requestName)
    .where(
      'systemVersion',
      '==',
      parseInt(functions.config().settings.systemVersion),
    )
    .limit(1)
    .get()
  return snapshot.docs[0].data()
}

const getGrantById = async grantID => {
  const snapshot = await grantsRef
    .where('id', '==', parseInt(grantID))
    .limit(1)
    .get()

  if (snapshot.empty) {
    return null
  }

  return snapshot.docs[0].data()
}

const getHypercert = async tokenID => {
  const snapshot = await hypercertsRef
    .where('tokenID', '==', tokenID)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return null
  }

  return snapshot.docs[0].data()
}

const updateHypercert = async (tokenID, payload) => {
  const snapshot = await hypercertsRef
    .where('tokenID', '==', tokenID)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return
  } else {
    const document = hypercertsRef.doc(snapshot.docs[0].id)
    await document.update({
      ...payload,
    })
  }
}

module.exports = {
  getGrantById,
  getGrantByTarget,
  getReviews,
  getReviewRequest,
  saveForm,
  saveRequest,
  saveReviews,
  saveAmendment,
  updateGrant,
  getHypercert,
  updateHypercert,
}
