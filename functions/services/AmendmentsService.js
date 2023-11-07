const { db } = require('../firebase')
const { AMENDMENTS_COLLECTION } = require('../constants/collections')
const amendmentsRef = db.collection(AMENDMENTS_COLLECTION)

const amendmentsByAttestationId = async attestationID => {
  try {
    const querySnapshot = await amendmentsRef
      .where('refUID', '==', attestationID)
      .orderBy('createdAt', 'desc')
      .get()

    const amendments = []

    querySnapshot.forEach(doc => {
      const amendmentData = doc.data()

      const amendmentObj = {
        amendmentUID: amendmentData.amendmentUID,
        createdAt: amendmentData.createdAt,
        pdfIpfsHash: amendmentData.pdfIpfsHash,
        attachmentsIpfsHashes: amendmentData.attachmentsIpfsHashes || [],
      }

      amendments.push(amendmentObj)
    })

    return amendments
  } catch (error) {
    console.error('Error fetching amendments:', error)
    return []
  }
}

module.exports = {
  amendmentsByAttestationId,
}
