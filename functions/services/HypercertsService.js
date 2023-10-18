const { db } = require('../firebase')

const { HYPERCERTS_COLLECTION } = require('../constants/collections')
const hypercertsRef = db.collection(HYPERCERTS_COLLECTION)

const searchHypercerts = async searchInput => {
  try {
    const snapshot = await hypercertsRef.where('processed', '==', 2).get()

    if (snapshot.empty) {
      return []
    } else {
      const hypercerts = snapshot.docs.map(doc => doc.data())
      const searchResults = hypercerts.filter(h => {
        return h.name.toLowerCase().includes(searchInput.toLowerCase())
      })
      return searchResults
    }
  } catch (e) {
    console.log(`error searching hypercerts: ${e}`)
  }
}

const getHypercertsCounts = async () => {
  const snapshot = await hypercertsRef.get()
  if (snapshot.empty) {
    return {totalHypercerts: 0}
  } else {
    const hypercerts = snapshot.docs.map(doc => doc.data())
    return {
      totalHypercerts: hypercerts.length,
      notProcessed: hypercerts.filter(h => h.processed === 0).length,
      processing: hypercerts.filter(h => h.processed === 1).length,
      processed: hypercerts.filter(h => h.processed === 2).length
    }
  }
}

module.exports = {
  searchHypercerts,
  getHypercertsCounts
}
