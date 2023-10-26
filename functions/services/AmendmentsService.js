const { db } = require('../firebase')
const { AMENDMENTS_COLLECTION } = require('../constants/collections')
const amendmentsRef = db.collection(AMENDMENTS_COLLECTION)

const amendmentsByAttestationId = async attestationID => {
  try {
    const querySnapshot = await amendmentsRef
      .where('refUID', '==', attestationID)
      .get()
    const allAttachmentsIpfsHashes = []

    querySnapshot.forEach(doc => {
      const amendmentData = doc.data()
      if (
        amendmentData.attachmentsIpfsHashes &&
        Array.isArray(amendmentData.attachmentsIpfsHashes)
      ) {
        allAttachmentsIpfsHashes.push(...amendmentData.attachmentsIpfsHashes)
      }
    })

    return allAttachmentsIpfsHashes
  } catch (error) {
    console.error('Error fetching amendments:', error)
    return []
  }
}

module.exports = {
  amendmentsByAttestationId,
}
