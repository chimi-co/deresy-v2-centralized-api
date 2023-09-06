const functions = require('firebase-functions')
const pinataSDK = require('@pinata/sdk')

const pinataApiKey = functions.config().settings.pinataApiKey
const pinataSecretApiKey = functions.config().settings.pinataSecretApiKey

const pinata = new pinataSDK(pinataApiKey, pinataSecretApiKey)

module.exports = pinata
