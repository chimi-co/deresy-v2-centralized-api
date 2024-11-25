const functions = require('firebase-functions')
const { groupBy } = require('lodash')
const axios = require('axios')

const { db } = require('../firebase')
const web3 = require('../web3')
const provider = require('../ethers')

const { Client, cacheExchange, fetchExchange } = require('@urql/core')

const {
  getGrantByTarget,
  getReviewRequest,
  getReviews,
  saveForm,
  saveRequest,
  saveReviews,
  saveAmendment,
  updateGrant,
  getHypercert,
  updateHypercert,
} = require('./DeresyDBService')

const { saveHypercert, saveNewHypercertToDB } = require('./HypercertsService')

const { MINTED_BLOCK_COLLECTION } = require('../constants/collections')
const { DERESY_CONTRACT_ABI } = require('../constants/contractConstants')
const { EAS, SchemaEncoder } = require('@ethereum-attestation-service/eas-sdk')

const mintedBlockRef = db.collection(MINTED_BLOCK_COLLECTION)
const CONTRACT_ADDRESS = functions.config().settings.contract_address
const EAS_CONTRACT_ADDRESS = functions.config().settings.eas_contract_address

const BLOCK_LIMIT = 100000

const getGrantScore = reviewsByGrant => {
  const scores = []

  reviewsByGrant.forEach(review => {
    const answer1Score = Number(review.answers[10])
    const answer2Score = Number(review.answers[11])
    scores.push((answer1Score + answer2Score) / 2)
  })

  const res = scores.reduce((x, y) => {
    return x + y
  }, 0)

  return res / scores.length
}

// eslint-disable-next-line  no-unused-vars
const updateGrantsScore = async requestName => {
  const { reviews } = await getReviews(requestName)

  const request = await getReviewRequest(requestName)
  const { targets } = request

  const reviewsByTarget = groupBy(reviews, 'targetIndex')
  const targetIndexes = Object.keys(reviewsByTarget)

  for (const index of targetIndexes) {
    const score = getGrantScore(reviewsByTarget[index])
    const grant = await getGrantByTarget(targets[index])
    await updateGrant(grant.documentId, { score })
  }

  functions.logger.log('Grants scores was updated')
}

const writeFormToDB = async (formName, tx, reviewForm) => {
  const choicesObj = reviewForm.choices.map(choices => {
    return { choices: choices }
  })
  const data = {
    formName: formName,
    questions: reviewForm.questions,
    types: reviewForm.questionTypes,
    choices: choicesObj,
    tx: tx,
  }
  await saveForm(formName, data)
}

const fetchRequestHypercerts = async hypercertIDs => {
  for (const hypercertID of hypercertIDs) {
    const hypercert = await getHypercert(hypercertID)
    if (!hypercert) {
      await saveNewHypercertToDB(hypercertID)
    } else if (hypercert.processed === 2) {
      const hypercertUri = hypercert.uri.startsWith('ipfs://')
        ? hypercert.uri.replace('ipfs://', '')
        : hypercert.uri
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
        await updateHypercert(hypercertID, {
          ...hypercert,
          metadata: hypercertMetadata,
          processed: 3,
        })
      }
    }
  }
}

const writeRequestToDB = async (requestName, reviewRequest, tx) => {
  const data = {
    formIpfsHash: reviewRequest.formIpfsHash,
    hypercertTargetIDs: reviewRequest.hypercertIDs,
    isClosed: reviewRequest.isClosed,
    requestName: requestName,
    reviewers: reviewRequest.reviewers,
    reviewFormName: reviewRequest.reviewFormName,
    rewardPerReview: reviewRequest.rewardPerReview,
    paymentTokenAddress: reviewRequest.paymentTokenAddress,
    targetsIPFSHashes: reviewRequest.hypercertIPFSHashes,
    tx: tx,
  }

  await saveRequest(requestName, data)
}

const writeReviewsToDB = async (requestName, reviews) => {
  const reviewsArray = []

  const schemaEncoder = new SchemaEncoder(
    'string requestName, uint256 hypercertID, string[] answers, string pdfIpfsHash, string[] attachmentsIpfsHashes',
  )
  const eas = new EAS(EAS_CONTRACT_ADDRESS)
  eas.connect(provider)

  for (const review of reviews) {
    const { reviewer, hypercertID, attestationID } = review
    const data = {
      reviewer,
      hypercertID,
      attestationID,
    }

    const attestation = await eas.getAttestation(attestationID)

    const createdAt = attestation.time.toNumber()
    const decodedData = schemaEncoder.decodeData(attestation.data)
    const answers = decodedData[2].value.value
    const pdfIpfsHash = decodedData[3].value.value
    const attachmentsIpfsHashes = decodedData[4].value.value

    reviewsArray.push({
      ...data,
      pdfIpfsHash,
      attachmentsIpfsHashes,
      answers,
      createdAt,
    })
  }

  const data = {
    requestName: requestName,
    reviews: reviewsArray,
  }

  await saveReviews(requestName, data)
  // TODO: add updateGrantsScore(requestName) function in this part when reviews monitor is working
}

const writeAmendmentsToDB = async amendmentUID => {
  const schemaEncoder = new SchemaEncoder(
    'string requestName, uint256 hypercertID, string amendment, string pdfIpfsHash, string[] attachmentsIpfsHashes',
  )
  const eas = new EAS(EAS_CONTRACT_ADDRESS)
  eas.connect(provider)

  const amendmentAttestation = await eas.getAttestation(amendmentUID)
  const decodedData = schemaEncoder.decodeData(amendmentAttestation.data)
  const createdAt = amendmentAttestation.time.toNumber()

  const data = {
    amendmentUID: amendmentUID,
    refUID: amendmentAttestation.refUID,
    requestName: decodedData[0].value.value,
    hypercertID: decodedData[1].value.value.toString(),
    amendment: decodedData[2].value.value,
    pdfIpfsHash: decodedData[3].value.value,
    attachmentsIpfsHashes: decodedData[4].value.value,
    createdAt: createdAt,
  }

  await saveAmendment(data)
}

const writeHypercertToDB = async hypercert => {
  let hypercertMetadata = {}
  const claimUri = hypercert.uri.startsWith('ipfs://')
    ? hypercert.uri.replace('ipfs://', '')
    : hypercert.uri

  try {
    const response = await axios.get(
      `${functions.config().settings.pinataDeresyGateway}/ipfs/${claimUri}`,
      {
        headers: {
          'x-pinata-gateway-token':
            functions.config().settings.pinataDeresyGatewayToken,
        },
      },
    )
    hypercertMetadata = response.data
    const name = hypercertMetadata.name || 'Name Unavailable'
    const data = {
      ...hypercert,
      name,
      processed: 2,
    }

    await saveHypercert(data)
  } catch (error) {
    console.error(`Error fetching/updating hypercert ${claimUri}:`)
  }
}

const processForms = async startFormBlock => {
  const latestBlockNumber = await web3.eth.getBlockNumber()
  if (latestBlockNumber > startFormBlock) {
    const smartContract = new web3.eth.Contract(
      DERESY_CONTRACT_ABI,
      CONTRACT_ADDRESS,
    )
    const snapshot = await mintedBlockRef
      .where('monitorType', '==', 'forms')
      .limit(1)
      .get()

    const lastBlockDoc = snapshot.docs[0]
    const blockIterations = parseInt(
      (latestBlockNumber - startFormBlock) / BLOCK_LIMIT,
    )
    const pastEvents = []
    let endBlock
    for (let i = 0; i <= blockIterations; i++) {
      const startBlock = startFormBlock + BLOCK_LIMIT * i
      endBlock = startBlock + BLOCK_LIMIT
      if (endBlock >= latestBlockNumber) {
        endBlock = 'latest'
      }
      const pastFormEvents = await smartContract.getPastEvents(
        'CreatedReviewForm',
        {},
        { fromBlock: startBlock, toBlock: endBlock },
      )
      pastFormEvents.forEach(ev => pastEvents.push(ev))
    }

    const updatedBlockNumber =
      endBlock == 'latest' ? latestBlockNumber : endBlock
    await mintedBlockRef
      .doc(lastBlockDoc.id)
      .update({ blockNumber: updatedBlockNumber })

    pastEvents.sort((a, b) => {
      return a.blockNumber - b.blockNumber
    })

    for (let i = 0; i < pastEvents.length; i++) {
      const formName = pastEvents[i].returnValues._formName
      const tx = pastEvents[i].transactionHash
      const reviewForm = await smartContract.methods
        .getReviewForm(formName)
        .call()

      await writeFormToDB(formName, tx, reviewForm)

      await mintedBlockRef
        .doc(lastBlockDoc.id)
        .update({ lastFormName: formName })
      await mintedBlockRef
        .doc(lastBlockDoc.id)
        .update({ lastSuccessTime: new Date() })
    }
  }
}

const processRequests = async startRequestBlock => {
  const latestBlockNumber = await web3.eth.getBlockNumber()
  if (latestBlockNumber > startRequestBlock) {
    const smartContract = new web3.eth.Contract(
      DERESY_CONTRACT_ABI,
      CONTRACT_ADDRESS,
    )
    const snapshot = await mintedBlockRef
      .where('monitorType', '==', 'requests')
      .limit(1)
      .get()

    const lastBlockDoc = snapshot.docs[0]
    const blockIterations = parseInt(
      (latestBlockNumber - startRequestBlock) / BLOCK_LIMIT,
    )
    const pastEvents = []
    let endBlock
    for (let i = 0; i <= blockIterations; i++) {
      const startBlock = startRequestBlock + BLOCK_LIMIT * i
      endBlock = startBlock + BLOCK_LIMIT
      if (endBlock >= latestBlockNumber) {
        endBlock = 'latest'
      }
      const pastCreatedEvents = await smartContract.getPastEvents(
        'CreatedReviewRequest',
        {},
        { fromBlock: startBlock, toBlock: endBlock },
      )
      const pastClosedEvents = await smartContract.getPastEvents(
        'ClosedReviewRequest',
        {},
        { fromBlock: startBlock, toBlock: endBlock },
      )
      pastCreatedEvents.forEach(ev => pastEvents.push(ev))
      pastClosedEvents.forEach(ev => pastEvents.push(ev))
    }

    const updatedBlockNumber =
      endBlock == 'latest' ? latestBlockNumber : endBlock
    await mintedBlockRef
      .doc(lastBlockDoc.id)
      .update({ blockNumber: updatedBlockNumber })

    pastEvents.sort((a, b) => {
      return a.blockNumber - b.blockNumber
    })

    for (let i = 0; i < pastEvents.length; i++) {
      const requestName = pastEvents[i].returnValues._requestName
      const tx = pastEvents[i].transactionHash
      const reviewRequest = await smartContract.methods
        .getRequest(requestName)
        .call()

      await fetchRequestHypercerts(reviewRequest.hypercertIDs)
      await writeRequestToDB(requestName, reviewRequest, tx)

      await mintedBlockRef
        .doc(lastBlockDoc.id)
        .update({ lastRequestName: requestName })
      await mintedBlockRef
        .doc(lastBlockDoc.id)
        .update({ lastSuccessTime: new Date() })
    }
  }
}

const processReviews = async startReviewBlock => {
  const latestBlockNumber = await web3.eth.getBlockNumber()
  if (latestBlockNumber > startReviewBlock) {
    const smartContract = new web3.eth.Contract(
      DERESY_CONTRACT_ABI,
      CONTRACT_ADDRESS,
    )
    const snapshot = await mintedBlockRef
      .where('monitorType', '==', 'reviews')
      .limit(1)
      .get()

    const lastBlockDoc = snapshot.docs[0]
    const latestBlockNumber = await web3.eth.getBlockNumber()
    const blockIterations = parseInt(
      (latestBlockNumber - startReviewBlock) / BLOCK_LIMIT,
    )
    const pastEvents = []
    let endBlock
    for (let i = 0; i <= blockIterations; i++) {
      const startBlock = startReviewBlock + BLOCK_LIMIT * i
      endBlock = startBlock + BLOCK_LIMIT
      if (endBlock >= latestBlockNumber) {
        endBlock = 'latest'
      }
      const pastReviewEvents = await smartContract.getPastEvents(
        'SubmittedReview',
        {},
        { fromBlock: startBlock, toBlock: endBlock },
      )
      pastReviewEvents.forEach(ev => pastEvents.push(ev))
    }

    const updatedBlockNumber =
      endBlock == 'latest' ? latestBlockNumber : endBlock
    await mintedBlockRef
      .doc(lastBlockDoc.id)
      .update({ blockNumber: updatedBlockNumber })

    pastEvents.sort((a, b) => {
      return a.blockNumber - b.blockNumber
    })

    for (let i = 0; i < pastEvents.length; i++) {
      const requestName = pastEvents[i].returnValues._requestName
      const tx = pastEvents[i].transactionHash
      const reviewRequest = await smartContract.methods
        .getRequest(requestName)
        .call()

      await writeReviewsToDB(requestName, reviewRequest.reviews, tx)

      await mintedBlockRef
        .doc(lastBlockDoc.id)
        .update({ lastRequestName: requestName })
      await mintedBlockRef
        .doc(lastBlockDoc.id)
        .update({ lastSuccessTime: new Date() })
    }
  }
}

const processAmendments = async startAmendmentBlock => {
  const latestBlockNumber = await web3.eth.getBlockNumber()
  if (latestBlockNumber > startAmendmentBlock) {
    const smartContract = new web3.eth.Contract(
      DERESY_CONTRACT_ABI,
      CONTRACT_ADDRESS,
    )
    const snapshot = await mintedBlockRef
      .where('monitorType', '==', 'amendments')
      .limit(1)
      .get()

    const lastBlockDoc = snapshot.docs[0]
    const latestBlockNumber = await web3.eth.getBlockNumber()
    const blockIterations = parseInt(
      (latestBlockNumber - startAmendmentBlock) / BLOCK_LIMIT,
    )
    const pastEvents = []
    let endBlock
    for (let i = 0; i <= blockIterations; i++) {
      const startBlock = startAmendmentBlock + BLOCK_LIMIT * i
      endBlock = startBlock + BLOCK_LIMIT
      if (endBlock >= latestBlockNumber) {
        endBlock = 'latest'
      }
      const pastAmendmentEvents = await smartContract.getPastEvents(
        'SubmittedAmendment',
        {},
        { fromBlock: startBlock, toBlock: endBlock },
      )
      pastAmendmentEvents.forEach(ev => pastEvents.push(ev))
    }

    const updatedBlockNumber =
      endBlock == 'latest' ? latestBlockNumber : endBlock
    await mintedBlockRef
      .doc(lastBlockDoc.id)
      .update({ blockNumber: updatedBlockNumber })

    pastEvents.sort((a, b) => {
      return a.blockNumber - b.blockNumber
    })

    for (let i = 0; i < pastEvents.length; i++) {
      const amendmentUI = pastEvents[i].returnValues._uid
      const tx = pastEvents[i].transactionHash

      await writeAmendmentsToDB(amendmentUI, tx)

      await mintedBlockRef
        .doc(lastBlockDoc.id)
        .update({ lastAmendmentUID: amendmentUI })
      await mintedBlockRef
        .doc(lastBlockDoc.id)
        .update({ lastSuccessTime: new Date() })
    }
  }
}

const processHypercerts = async lastHypercertCreation => {
  const snapshot = await mintedBlockRef
    .where('monitorType', '==', 'hypercerts')
    .limit(1)
    .get()

  const lastBlockDoc = snapshot.docs[0]

  const client = new Client({
    url: 'https://api.hypercerts.org/v1/graphql',
    exchanges: [cacheExchange, fetchExchange],
  })

  let hypercertsQuery = `
    query searchHypercert($hypercertName: String) {
      hypercerts(
        first: 1
        where: { creation_block_timestamp: { gt: $lastHypercertCreation } } }
        sort: {by: {creation_block_timestamp: ascending}}
      ) {
        count
        data {
          id
          creation_block_timestamp
          token_id
          metadata {
            uri
            name
          }
        }
      }
    }
  `
  let hypercertFromQuery = await client.query(hypercertsQuery, {
    lastHypercertCreation: lastHypercertCreation.toString(),
  })

  if (
    hypercertFromQuery &&
    hypercertFromQuery.data &&
    hypercertFromQuery.data.hypercerts &&
    hypercertFromQuery.data.hypercerts.data.length > 0
  ) {
    const claims = hypercertFromQuery.data.hypercerts.data.map(cert => ({
      id: cert.id,
      creation: cert.creation_block_timestamp,
      uri: cert.metadata.uri,
      tokenID: cert.token_id,
      name: cert.metadata.name
    }))
    await writeHypercertToDB(claims[0])
    await mintedBlockRef
      .doc(lastBlockDoc.id)
      .update({ lastHypercertCreation: hypercertFromQuery.data.claims[0].creation })
  }
}

const monitorForms = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '8GB',
  })
  .pubsub.schedule('every 1 minutes')
  .onRun(async () => {
    try {
      let lastFormBlock
      const snapshot = await mintedBlockRef
        .where('monitorType', '==', 'forms')
        .limit(1)
        .get()

      const doc = snapshot.docs[0]

      if (!doc.exists) {
        lastFormBlock = 0
      } else {
        lastFormBlock = doc.data().blockNumber
      }

      let startFormBlock = lastFormBlock + 1
      if (
        !doc.data().formsInProgress || // check if a mint is already in progress
        new Date() - doc.data().lastSuccessTime.toDate() > 540000 // go ahead and run if it's been 9 minutes since last successful run
      ) {
        await mintedBlockRef.doc(doc.id).update({ formsInProgress: true })
        await processForms(startFormBlock)
        await mintedBlockRef.doc(doc.id).update({ formsInProgress: false })
        await mintedBlockRef.doc(doc.id).update({ lastSuccessTime: new Date() })
      }
    } catch (error) {
      functions.logger.error('[ !!! ] Error: ', error)
      throw new functions.https.HttpsError(error.code, error.message)
    }
  })

const monitorRequests = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '8GB',
  })
  .pubsub.schedule('every 1 minutes')
  .onRun(async () => {
    try {
      let lastRequestBlock
      const snapshot = await mintedBlockRef
        .where('monitorType', '==', 'requests')
        .limit(1)
        .get()
      const doc = snapshot.docs[0]
      if (!doc.exists) {
        lastRequestBlock = 0
      } else {
        lastRequestBlock = doc.data().blockNumber
      }

      let startRequestBlock = lastRequestBlock + 1
      if (
        !doc.data().requestsInProgress || // check if an update is already in progress
        new Date() - doc.data().lastSuccessTime.toDate() > 540000 // go ahead and run if it's been 9 minutes since last successful run
      ) {
        await mintedBlockRef.doc(doc.id).update({ requestsInProgress: true })
        await processRequests(startRequestBlock)
        await mintedBlockRef.doc(doc.id).update({ requestsInProgress: false })
        await mintedBlockRef.doc(doc.id).update({ lastSuccessTime: new Date() })
      }
    } catch (error) {
      functions.logger.error('[ !!! ] Error: ', error)
      throw new functions.https.HttpsError(error.code, error.message)
    }
  })

const monitorReviews = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '8GB',
  })
  .pubsub.schedule('every 1 minutes')
  .onRun(async () => {
    try {
      let lastReviewBlock
      const snapshot = await mintedBlockRef
        .where('monitorType', '==', 'reviews')
        .limit(1)
        .get()
      const doc = snapshot.docs[0]
      if (!doc.exists) {
        lastReviewBlock = 0
      } else {
        lastReviewBlock = doc.data().blockNumber
      }

      let startReviewBlock = lastReviewBlock + 1
      if (
        !doc.data().requestsInProgress || // check if an update is already in progress
        new Date() - doc.data().lastSuccessTime.toDate() > 540000 // go ahead and run if it's been 9 minutes since last successful run
      ) {
        await mintedBlockRef.doc(doc.id).update({ reviewsInProgress: true })
        await processReviews(startReviewBlock)
        await mintedBlockRef.doc(doc.id).update({ reviewsInProgress: false })
        await mintedBlockRef.doc(doc.id).update({ lastSuccessTime: new Date() })
      }
    } catch (error) {
      functions.logger.error('[ !!! ] Error: ', error)
      throw new functions.https.HttpsError(error.code, error.message)
    }
  })

const monitorAmendments = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '8GB',
  })
  .pubsub.schedule('every 1 minutes')
  .onRun(async () => {
    try {
      let lastAmendmentBlock
      const snapshot = await mintedBlockRef
        .where('monitorType', '==', 'amendments')
        .limit(1)
        .get()
      const doc = snapshot.docs[0]
      if (!doc.exists) {
        lastAmendmentBlock = 0
      } else {
        lastAmendmentBlock = doc.data().blockNumber
      }

      let startAmendmentBlock = lastAmendmentBlock + 1
      if (
        !doc.data().amendmentsInProgress || // check if an update is already in progress
        new Date() - doc.data().lastSuccessTime.toDate() > 540000 // go ahead and run if it's been 9 minutes since last successful run
      ) {
        await mintedBlockRef.doc(doc.id).update({ amendmentsInProgress: true })
        await processAmendments(startAmendmentBlock)
        await mintedBlockRef.doc(doc.id).update({ amendmentsInProgress: false })
        await mintedBlockRef.doc(doc.id).update({ lastSuccessTime: new Date() })
      }
    } catch (error) {
      functions.logger.error('[ !!! ] Error: ', error)
      throw new functions.https.HttpsError(error.code, error.message)
    }
  })

const monitorHypercerts = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '8GB',
  })
  .pubsub.schedule('every 1 minutes')
  .onRun(async () => {
    try {
      let lastHypercertCreation
      const snapshot = await mintedBlockRef
        .where('monitorType', '==', 'hypercerts')
        .limit(1)
        .get()
      const doc = snapshot.docs[0]
      if (!doc.exists) {
        lastHypercertCreation = 0
      } else {
        lastHypercertCreation = doc.data().lastHypercertCreation
      }

      if (
        !doc.data().hypercertsInProgress || // check if an update is already in progress
        new Date() - doc.data().lastSuccessTime.toDate() > 540000 // go ahead and run if it's been 9 minutes since last successful run
      ) {
        await mintedBlockRef.doc(doc.id).update({ hypercertsInProgress: true })
        await processHypercerts(lastHypercertCreation)
        await mintedBlockRef.doc(doc.id).update({ hypercertsInProgress: false })
        await mintedBlockRef.doc(doc.id).update({ lastSuccessTime: new Date() })
      }
    } catch (error) {
      functions.logger.error('[ !!! ] Error: ', error)
      throw new functions.https.HttpsError(error.code, error.message)
    }
  })

module.exports = {
  monitorForms,
  monitorRequests,
  monitorReviews,
  monitorAmendments,
  monitorHypercerts,
}
