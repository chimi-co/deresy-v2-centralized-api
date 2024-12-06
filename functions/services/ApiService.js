const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')({ origin: true })
const { https, logger } = functions
const { Readable } = require('stream')

const { uploadPdf, uploadFileToIpfs } = require('./PinataService')
const {
  getHypercertsCounts,
  getLatestHypercerts,
  saveHypercert,
} = require('./HypercertsService')
const { searchReviewsByHypercertID } = require('./ReviewsService')

const app = express()

app.get('/health_check', (request, response) => {
  return cors(request, response, async () => {
    try {
      response.send({ status: 'ok' })
    } catch (error) {
      logger.error('[ !!! ] Error: ', error)
      throw new https.HttpsError(error.code, error.message)
    }
  })
})

app.post('/generate_pdf', (request, response) => {
  return cors(request, response, async () => {
    try {
      const payload = JSON.parse(request.body)

      const pinataPayload = await uploadPdf(payload)

      response.send(pinataPayload)
    } catch (error) {
      logger.error('[ !!! ] Error: ', error)
      throw new https.HttpsError(error.code, error.message)
    }
  })
})

app.get('/get_hypercerts_counts', (request, response) => {
  return cors(request, response, async () => {
    try {
      const hypercertsCounts = await getHypercertsCounts()
      response.send(JSON.stringify(hypercertsCounts))
    } catch (error) {
      logger.error('[ !!! ] Error: ', error)
      throw new https.HttpsError(error.code, error.message)
    }
  })
})

app.get('/get_latest_hypercerts', (request, response) => {
  return cors(request, response, async () => {
    try {
      const latestHypercerts = await getLatestHypercerts()
      response.send(JSON.stringify(latestHypercerts))
    } catch (error) {
      logger.error('[ !!! ] Error: ', error)
      throw new https.HttpsError(error.code, error.message)
    }
  })
})

app.get('/save_hypercert', (request, response) => {
  return cors(request, response, async () => {
    try {
      const hypercert = request.body
      await saveHypercert(hypercert)
      response.status(201).send({message: 'hypercert saved successfully'})
    } catch (error) {
      logger.error('[ !!! ] Error: ', error)
      throw new https.HttpsError(error.code, error.message)
    }
  })
})

app.get('/search_reviews', (request, response) => {
  return cors(request, response, async () => {
    try {
      const { hypercertID } = request.query
      const reviewsResults = await searchReviewsByHypercertID(hypercertID)

      response.send(reviewsResults)
    } catch (error) {
      logger.error('[ !!! ] Error: ', error)
      throw new https.HttpsError(error.code, error.message)
    }
  })
})

app.post('/upload-file-to-ipfs', async (req, res) => {
  return cors(req, res, async () => {
    try {
      const payload = JSON.parse(req.body)

      const fileBuffer = Buffer.from(payload.file, 'base64')

      const readableStream = new Readable({
        read() {
          this.push(fileBuffer)
          this.push(null)
        },
      })

      const ipfsHash = await uploadFileToIpfs(readableStream)
      res.status(200).send({ ipfsHash })
    } catch (error) {
      logger.error('[ !!! ] Error: ', error)
      res.status(500).send({ error: error.message })
    }
  })
})

exports.api = functions
  .runWith({ memory: '1GB', timeoutSeconds: 540 })
  .https.onRequest(app)
