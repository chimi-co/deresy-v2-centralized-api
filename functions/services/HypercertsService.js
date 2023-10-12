const { Client, cacheExchange, fetchExchange } = require('@urql/core')
const fetch = require('node-fetch')
const { db } = require('../firebase')

const { HYPERCERTS_COLLECTION } = require('../constants/collections')
const { getSixMonthsAgoTimestamp } = require('../utils')
const hypercertsRef = db.collection(HYPERCERTS_COLLECTION)

const getHypercerts = async () => {
  try {
    const allClaims = []
    const client = new Client({
      url: 'https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-optimism-mainnet',
      exchanges: [cacheExchange, fetchExchange],
    })

    let lastTokenID = ''

    const snapshot = await hypercertsRef.get()

    const storedHypercerts = snapshot.docs.map(doc => doc.data())
    console.log('Stored hypercerts:', storedHypercerts.length)

    const maxTokenID = storedHypercerts
      .reduce((max, current) => {
        const currentTokenID = current.tokenID
        return currentTokenID > max ? currentTokenID : max
      }, 0)
      .toString()

    const maxCreation = storedHypercerts
      .reduce((max, current) => {
        const currentCreation = parseInt(current.creation)
        return currentCreation > max ? currentCreation : max
      }, 0)
      .toString()

    //console.log('Max tokenID:', maxTokenID)
    //console.log('Max creation:', maxCreation)

    let hasNextPage = true

    let claimsQuery = ''
    let claimsFromQuery = {}

    if (maxTokenID == !'0' && maxCreation == !'0') {
      claimsQuery = `
        query claims($lastTokenID: String, $maxCreation: String) {
          claims(
            first: 1000
            orderBy: tokenID
            orderDirection: asc
            where: { tokenID_gt: $lastTokenID, creation_gte: $maxCreation }
          ) {
            id
            tokenID
            uri
            creation
          }
        }
      `

      claimsFromQuery = await client.query(claimsQuery, {
        lastTokenID,
        maxCreation,
      })
      if (claimsFromQuery.data && claimsFromQuery.data.claims.length > 0) {
        const claims = claimsFromQuery.data.claims
        allClaims.push(...claims)
        lastTokenID = claims[claims.length - 1].tokenID
      } else {
        hasNextPage = false
      }
    } else {
      claimsQuery = `
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
      claimsFromQuery = await client.query(claimsQuery)
    }

    if (claimsFromQuery.data && claimsFromQuery.data.claims.length > 0) {
      const claims = claimsFromQuery.data.claims
      allClaims.push(...claims)
      lastTokenID = claims[claims.length - 1].tokenID
    } else {
      hasNextPage = false
    }
    while (hasNextPage) {
      claimsQuery = `
        query claims($lastTokenID: String, $maxCreation: String) {
          claims(
            first: 1000
            orderBy: tokenID
            orderDirection: asc
            where: { tokenID_gt: $lastTokenID, creation_gte: $maxCreation }
          ) {
            id
            tokenID
            uri
            creation
          }
        }
      `

      claimsFromQuery = await client.query(claimsQuery, {
        lastTokenID,
        maxCreation,
      })
      if (claimsFromQuery.data && claimsFromQuery.data.claims.length > 0) {
        const claims = claimsFromQuery.data.claims
        allClaims.push(...claims)
        lastTokenID = claims[claims.length - 1].tokenID
      } else {
        hasNextPage = false
      }
    }
    let count = 0
    for (const claim of allClaims) {
      const hypercert = await getHypercertName(claim)
      await saveHypercert(hypercert)
      console.log(`saved hypercert ${count++} of ${allClaims.length}`)
    }
    return allClaims.length
  } catch (e) {
    console.log(`error getting hypercerts: ${e}`)
  }
}

const getHypercertName = async claim => {
  try {
    let data = {}
    const claimUri = claim.uri.startsWith('ipfs://')
      ? claim.uri.replace('ipfs://', '')
      : claim.uri
    try {
      data = await (await fetch(`https://ipfs.io/ipfs/${claimUri}`)).json()
    } catch (e) {
      console.log(`error getting hypercert data: ${e}`)
    }
    const claimName = `${data.name ? data.name : 'Name Unavailable'} (ID: ${
      claim.tokenID
    })`
    return {
      name: claimName,
      tokenID: claim.tokenID,
      id: claim.id,
      uri: claimUri,
      creation: claim.creation,
    }
  } catch (e) {
    console.log(`error getting hypercert name: ${e}`)
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

module.exports = {
  getHypercerts,
  searchHypercerts,
}
