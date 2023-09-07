const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')({ origin: true })
const { https, logger } = functions

const { uploadPdf } = require('./PinataService')

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

      console.log(pinataPayload)

      response.send(pinataPayload)
    } catch (error) {
      logger.error('[ !!! ] Error: ', error)
      throw new https.HttpsError(error.code, error.message)
    }
  })
})

const api = functions.https.onRequest(app)

module.exports = {
  api,
}
