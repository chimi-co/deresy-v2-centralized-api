const { db } = require('../firebase')
const axios = require('axios')

const { HYPERCERTS_COLLECTION } = require('../constants/collections')
const hypercertsRef = db.collection(HYPERCERTS_COLLECTION)

const fetchHypercert = async hypercertID => {
  console.log('Fetching hypercert with ID', hypercertID)
  try {
    const snapshot = await hypercertsRef
      .where('tokenID', '==', hypercertID)
      .where('processed', '==', 2)
      .limit(1)
      .get()

    if (snapshot.empty) {
      console.log('Could not find hypercert with ID', hypercertID)
      return
    } else {
      const hypercertDoc = snapshot.docs[0]
      const hypercert = hypercertDoc.data()
      const hypercertUri = hypercert.uri.startsWith('ipfs://')
        ? hypercert.uri.replace('ipfs://', '')
        : hypercert.uri

      const hypercertMetadataResponse = await axios.get(
        `https://ipfs.io/ipfs/${hypercertUri}`,
      )
      if (
        hypercertMetadataResponse &&
        hypercertMetadataResponse.data !== null &&
        hypercertMetadataResponse.data !== undefined
      ) {
        const hypercertMetadata = hypercertMetadataResponse.data
        await hypercertDoc.ref.update({
          metadata: hypercertMetadata,
          processed: 3,
        })
      } else {
        console.log('Failed to fetch hypercertMetadata.')
        return
      }
    }
  } catch (e) {
    console.log('Failed to fetch hypercert')
    console.log(e)
  }
}

module.exports = {
  fetchHypercert,
}
