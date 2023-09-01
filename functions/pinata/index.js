const functions = require('firebase-functions')
const pinataSDK = require('@pinata/sdk')

const pinataApiKey = functions.config().settings.pinataApiKey
const pinataSecretApiKey = functions.config().settings.pinataSecretApiKey

console.log('pinataApiKey', pinataApiKey)
console.log('pinataSecretApiKey', pinataSecretApiKey)

const pinata = new pinataSDK(pinataApiKey, pinataSecretApiKey)

module.exports = pinata
