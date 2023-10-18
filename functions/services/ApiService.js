const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')({ origin: true })
const { https, logger } = functions

const { uploadPdf } = require('./PinataService')
const { /*getHypercertsCounts,*/ searchHypercerts } = require('./HypercertsService')

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
/*
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
*/
app.get('/search_hypercerts', (request, response) => {
  return cors(request, response, async () => {
    try {
      const { searchInput } = request.query
      const hypercertResults = await searchHypercerts(searchInput)
      response.send(hypercertResults)
    } catch (error) {
      logger.error('[ !!! ] Error: ', error)
      throw new https.HttpsError(error.code, error.message)
    }
  })
})

exports.api = functions
  .runWith({ memory: '512MB', timeoutSeconds: 540 })
  .https.onRequest(app)
