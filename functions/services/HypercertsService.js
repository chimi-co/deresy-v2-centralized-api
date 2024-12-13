const { db } = require('../firebase')
const functions = require('firebase-functions')

const axios = require('axios')
const { Client, cacheExchange, fetchExchange } = require('@urql/core')

const { HYPERCERTS_COLLECTION } = require('../constants/collections')
const { getSixMonthsAgoTimestamp } = require('../utils')
const hypercertsRef = db.collection(HYPERCERTS_COLLECTION)

const searchHypercerts = async (searchInput, lastSixMonths) => {
  try {
    let snapshot

    if (lastSixMonths === 'true') {
      snapshot = await hypercertsRef
        .where('creation', '>', getSixMonthsAgoTimestamp().toString())
        .get()
    } else {
      snapshot = await hypercertsRef.get()
    }

    const hypercerts = snapshot.docs.map(doc => doc.data())
    const searchResults = hypercerts.filter(h => {
      return h.name.toLowerCase().includes(searchInput.toLowerCase())
    })

    searchResults.sort((a, b) => a.name.localeCompare(b.name))

    return searchResults
  } catch (e) {
    console.log(`error searching hypercerts: ${e}`)
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

const saveNewHypercertToDB = async hypercertID => {
  try {
    const client = new Client({
      url: 'https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-optimism-mainnet',
      exchanges: [cacheExchange, fetchExchange],
    })

    let claimQuery = `
      query claims($hypercertID: String!) {
        claims(where: {tokenID: $hypercertID}) {
          id
          uri
          creation
          tokenID
        }
      }
    `

    let queryVariables = {
      hypercertID: hypercertID,
    }

    let claimFromQuery = await client.query(claimQuery, queryVariables)

    const dataHypercertQuery = claimFromQuery.data.claims[0]
    if (dataHypercertQuery.uri) {
      const hypercertUri = dataHypercertQuery.uri.startsWith('ipfs://')
        ? dataHypercertQuery.uri.replace('ipfs://', '')
        : dataHypercertQuery.uri

      const hypercertMetadataResponse = await axios.get(
        `${
          functions.config().settings.pinataDeresyGateway
        }/ipfs/${hypercertUri}`,
        {
          headers: {
            'x-pinata-gateway-token':
              functions.config().settings.pinataDeresyGatewayToken,
          },
        },
      )

      if (
        hypercertMetadataResponse &&
        hypercertMetadataResponse.data !== null &&
        hypercertMetadataResponse.data !== undefined
      ) {
        const hypercertMetadata = hypercertMetadataResponse.data

        const hypercertToSave = {
          ...dataHypercertQuery,
          metadata: hypercertMetadata,
          processed: 3,
          name: hypercertMetadata.name || 'Name Unavailable',
        }

        await saveHypercert(hypercertToSave)
      } else {
        const data = {
          ...dataHypercertQuery,
          name: 'Name Unavailable',
          processed: 3,
        }
        await saveHypercert(data)
      }
    } else {
      const data = {
        ...dataHypercertQuery,
        name: 'NULL_URI_HYPERCERT',
        processed: 3,
      }
      await saveHypercert(data)
    }
  } catch (e) {
    console.error('[ERROR] Error creating the new Hypercert')
    console.error(e)
  }
}

module.exports = {
  searchHypercerts,
  saveHypercert,
  getHypercertsCounts,
  getLatestHypercerts,
  saveNewHypercertToDB,
}
