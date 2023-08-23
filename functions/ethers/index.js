const { ethers } = require('ethers')
const functions = require('firebase-functions')

const NETWORK = functions.config().settings.network
const API_KEY = functions.config().settings.infura_api_key

const provider = new ethers.providers.InfuraProvider(NETWORK, API_KEY)

module.exports = provider
