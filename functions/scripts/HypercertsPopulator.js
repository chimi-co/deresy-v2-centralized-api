const { Client, cacheExchange, fetchExchange } = require('@urql/core')
const { db } = require('../firebase')
const axios = require('axios')

const { HYPERCERTS_COLLECTION } = require('../constants/collections')
const hypercertsRef = db.collection(HYPERCERTS_COLLECTION)

const getAllHypercerts = async () => {
  const allClaims = []
  const client = new Client({
    url: 'https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-optimism-mainnet',
    exchanges: [cacheExchange, fetchExchange],
  })

  let lastTokenID = ''

  let hasNextPage = true

  let claimsQuery = `
    query claims {
      claims(
        first: 1000
        orderBy: tokenID
        orderDirection: asc
      ) {
        id
        tokenID
        uri
        creation
      }
    }
  `
  let claimsFromQuery = await client.query(claimsQuery)
  if (claimsFromQuery.data && claimsFromQuery.data.claims.length > 0) {
    const claims = claimsFromQuery.data.claims
    allClaims.push(...claims)
    lastTokenID = claims[claims.length - 1].creation
  } else {
    hasNextPage = false
  }
  while (hasNextPage) {
    claimsQuery = `
      query claims($lastTokenID: String) {
        claims(
          first: 1000
          orderBy: creation
          orderDirection: asc
          where: { creation_gt: $lastTokenID }
        ) {
          id
          creation
          tokenID
          uri
        }
      }
    `

    claimsFromQuery = await client.query(claimsQuery, { lastTokenID })
    if (claimsFromQuery.data && claimsFromQuery.data.claims.length > 0) {
      const claims = claimsFromQuery.data.claims
      allClaims.push(...claims)
      lastTokenID = claims[claims.length - 1].creation
    } else {
      hasNextPage = false
    }
  }
  console.log('totalHypercerts', allClaims.length)

  const batchSize = 5000

  for (let i = 0; i < allClaims.length; i += batchSize) {
    const batch = db.batch()
    const batchData = allClaims.slice(i, i + batchSize)

    batchData.forEach(record => {
      const newDocRef = hypercertsRef.doc()
      batch.set(newDocRef, {
        ...record,
        name: 'Name Unavailable',
        processed: 0,
      })
    })

    await batch.commit()
  }

  const snapshot = await hypercertsRef.get()

  const storedHypercerts = snapshot.docs.map(doc => doc.data())
  console.log('Stored hypercerts:', storedHypercerts.length)
  return allClaims.length
}

async function getHypercertsNames() {
  const batchSize = 10
  let hasMoreHypercerts = true

  while (hasMoreHypercerts) {
    const querySnapshot = await hypercertsRef
      .where('processed', '==', 0)
      .limit(batchSize)
      .get()

    if (querySnapshot.empty) {
      // No more hypercerts to process, exit the loop
      console.log('No more hypercerts to process. Exiting.')
      hasMoreHypercerts = false
      break
    }

    const updates = []

    querySnapshot.forEach(doc => {
      const hypercertRef = db.collection('yourCollection').doc(doc.id)

      updates.push(
        db.runTransaction(async transaction => {
          const docSnapshot = await transaction.get(hypercertRef)

          if (!docSnapshot.exists || docSnapshot.data().processed === 1) {
            // The document has been updated by another function
            return
          }

          transaction.update(hypercertRef, { processed: 1 })
        }),
      )
    })

    await Promise.all(updates)

    const fetchNamePromises = querySnapshot.docs.map(async doc => {
      const hypercert = doc.data()
      let hypercertMetadata = {}
      const claimUri = hypercert.uri.startsWith('ipfs://')
        ? hypercert.uri.replace('ipfs://', '')
        : hypercert.uri

      try {
        const response = await axios.get(`https://ipfs.io/ipfs/${claimUri}`)
        hypercertMetadata = response.data
        const name = hypercertMetadata.name || 'Name Unavailable'

        await hypercertsRef.doc(doc.id).update({
          name,
          processed: 2,
        })

        console.log(`Updated hypercert ${doc.id} with name: ${name}`)
      } catch (error) {
        console.error(`Error fetching/updating hypercert ${claimUri}:`)
      }
    })

    await Promise.all(fetchNamePromises)
  }
}

module.exports = {
  getAllHypercerts,
  getHypercertsNames,
}
