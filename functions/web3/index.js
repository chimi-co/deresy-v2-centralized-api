const Web3 = require('web3')
const functions = require('firebase-functions')

const infuraBaseUrl = functions.config().settings.infura_provider
const apikey = functions.config().settings.infura_api_key
const provider = `${infuraBaseUrl}/${apikey}`

const web3 = new Web3(provider)

module.exports = web3
