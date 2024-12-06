const { db } = require('../firebase')

const { HYPERCERTS_COLLECTION } = require('../constants/collections')
const hypercertsRef = db.collection(HYPERCERTS_COLLECTION)


const saveHypercert = async hypercert => {
  try {
    const snapshot = await hypercertsRef
      .where('id', '==', hypercert.id)
      .limit(1)
      .get()

    if (snapshot.empty) {
      await hypercertsRef.add({
        ...hypercert,
      })
    } else {
      const document = hypercertsRef.doc(snapshot.docs[0].id)
      await document.update({
        ...hypercert,
      })
    }
  } catch (e) {
    console.log(`error saving hypercert: ${e}`)
  }
}

const getHypercertsCounts = async () => {
  const snapshot = await hypercertsRef.get()
  if (snapshot.empty) {
    return { totalHypercerts: 0 }
  } else {
    const hypercerts = snapshot.docs.map(doc => doc.data())
    return {
      totalHypercerts: hypercerts.length,
      notProcessed: hypercerts.filter(h => h.processed === 0).length,
      processing: hypercerts.filter(h => h.processed === 1).length,
      processed: hypercerts.filter(h => h.processed === 2).length,
    }
  }
}

const getLatestHypercerts = async () => {
  try {
    const snapshot = await hypercertsRef
      .orderBy('creation', 'desc')
      .limit(10)
      .get()

    if (snapshot.empty) {
      return []
    } else {
      return snapshot.docs.map(doc => doc.data())
    }
  } catch (e) {
    console.log(`error getting latest hypercerts: ${e}`)
  }
}


module.exports = {
  saveHypercert,
  getHypercertsCounts,
  getLatestHypercerts
}
