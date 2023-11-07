module.exports = {
  DERESY_CONTRACT_ABI: [
		{
			"inputs": [
				{
					"internalType": "contract IEAS",
					"name": "eas",
					"type": "address"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [],
			"name": "AccessDenied",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "InsufficientValue",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "InvalidEAS",
			"type": "error"
		},
		{
			"inputs": [],
			"name": "NotPayable",
			"type": "error"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "string",
					"name": "_requestName",
					"type": "string"
				}
			],
			"name": "ClosedReviewRequest",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "string",
					"name": "_formName",
					"type": "string"
				}
			],
			"name": "CreatedReviewForm",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "string",
					"name": "_requestName",
					"type": "string"
				}
			],
			"name": "CreatedReviewRequest",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"components": [
						{
							"internalType": "bytes32",
							"name": "uid",
							"type": "bytes32"
						},
						{
							"internalType": "bytes32",
							"name": "schema",
							"type": "bytes32"
						},
						{
							"internalType": "uint64",
							"name": "time",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "expirationTime",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "revocationTime",
							"type": "uint64"
						},
						{
							"internalType": "bytes32",
							"name": "refUID",
							"type": "bytes32"
						},
						{
							"internalType": "address",
							"name": "recipient",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "attester",
							"type": "address"
						},
						{
							"internalType": "bool",
							"name": "revocable",
							"type": "bool"
						},
						{
							"internalType": "bytes",
							"name": "data",
							"type": "bytes"
						}
					],
					"indexed": false,
					"internalType": "struct Attestation",
					"name": "_attestation",
					"type": "tuple"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "_requestName",
					"type": "string"
				}
			],
			"name": "OnReviewCallback",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "previousOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "OwnershipTransferred",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "bytes32",
					"name": "_uid",
					"type": "bytes32"
				}
			],
			"name": "SubmittedAmendment",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "string",
					"name": "_requestName",
					"type": "string"
				}
			],
			"name": "SubmittedReview",
			"type": "event"
		},
		{
			"inputs": [],
			"name": "amendmentsSchemaID",
			"outputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"components": [
						{
							"internalType": "bytes32",
							"name": "uid",
							"type": "bytes32"
						},
						{
							"internalType": "bytes32",
							"name": "schema",
							"type": "bytes32"
						},
						{
							"internalType": "uint64",
							"name": "time",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "expirationTime",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "revocationTime",
							"type": "uint64"
						},
						{
							"internalType": "bytes32",
							"name": "refUID",
							"type": "bytes32"
						},
						{
							"internalType": "address",
							"name": "recipient",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "attester",
							"type": "address"
						},
						{
							"internalType": "bool",
							"name": "revocable",
							"type": "bool"
						},
						{
							"internalType": "bytes",
							"name": "data",
							"type": "bytes"
						}
					],
					"internalType": "struct Attestation",
					"name": "attestation",
					"type": "tuple"
				}
			],
			"name": "attest",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "callbackContract",
			"outputs": [
				{
					"internalType": "contract IOnReviewable",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				}
			],
			"name": "closeReviewRequest",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "contractVersion",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "address[]",
					"name": "reviewers",
					"type": "address[]"
				},
				{
					"internalType": "uint256[]",
					"name": "hypercertIDs",
					"type": "uint256[]"
				},
				{
					"internalType": "string[]",
					"name": "hypercertIPFSHashes",
					"type": "string[]"
				},
				{
					"internalType": "string",
					"name": "formIpfsHash",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "reviewFormName",
					"type": "string"
				}
			],
			"name": "createNonPayableRequest",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "address[]",
					"name": "reviewers",
					"type": "address[]"
				},
				{
					"internalType": "uint256[]",
					"name": "hypercertIDs",
					"type": "uint256[]"
				},
				{
					"internalType": "string[]",
					"name": "hypercertIPFSHashes",
					"type": "string[]"
				},
				{
					"internalType": "string",
					"name": "formIpfsHash",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "rewardPerReview",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "paymentTokenAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "reviewFormIndex",
					"type": "string"
				}
			],
			"name": "createRequest",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "string[]",
					"name": "questions",
					"type": "string[]"
				},
				{
					"internalType": "string[][]",
					"name": "choices",
					"type": "string[][]"
				},
				{
					"internalType": "enum DeresyResolver.QuestionType[]",
					"name": "questionTypes",
					"type": "uint8[]"
				}
			],
			"name": "createReviewForm",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				}
			],
			"name": "getRequest",
			"outputs": [
				{
					"components": [
						{
							"internalType": "address",
							"name": "sponsor",
							"type": "address"
						},
						{
							"internalType": "address[]",
							"name": "reviewers",
							"type": "address[]"
						},
						{
							"internalType": "uint256[]",
							"name": "hypercertIDs",
							"type": "uint256[]"
						},
						{
							"internalType": "string[]",
							"name": "hypercertIPFSHashes",
							"type": "string[]"
						},
						{
							"internalType": "string",
							"name": "formIpfsHash",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "rewardPerReview",
							"type": "uint256"
						},
						{
							"components": [
								{
									"internalType": "address",
									"name": "reviewer",
									"type": "address"
								},
								{
									"internalType": "uint256",
									"name": "hypercertID",
									"type": "uint256"
								},
								{
									"internalType": "bytes32",
									"name": "attestationID",
									"type": "bytes32"
								},
								{
									"internalType": "bytes32[]",
									"name": "amendmentsUIDs",
									"type": "bytes32[]"
								}
							],
							"internalType": "struct DeresyResolver.Review[]",
							"name": "reviews",
							"type": "tuple[]"
						},
						{
							"internalType": "bool",
							"name": "isClosed",
							"type": "bool"
						},
						{
							"internalType": "address",
							"name": "paymentTokenAddress",
							"type": "address"
						},
						{
							"internalType": "uint256",
							"name": "fundsLeft",
							"type": "uint256"
						},
						{
							"internalType": "string",
							"name": "reviewFormName",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "name",
							"type": "string"
						}
					],
					"internalType": "struct DeresyResolver.ReviewRequest",
					"name": "reviewRequest",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				}
			],
			"name": "getRequestReviewForm",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string[]",
							"name": "questions",
							"type": "string[]"
						},
						{
							"internalType": "enum DeresyResolver.QuestionType[]",
							"name": "questionTypes",
							"type": "uint8[]"
						},
						{
							"internalType": "string[][]",
							"name": "choices",
							"type": "string[][]"
						}
					],
					"internalType": "struct DeresyResolver.ReviewForm",
					"name": "requestReviewForm",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_reviewFormName",
					"type": "string"
				}
			],
			"name": "getReviewForm",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string[]",
							"name": "questions",
							"type": "string[]"
						},
						{
							"internalType": "enum DeresyResolver.QuestionType[]",
							"name": "questionTypes",
							"type": "uint8[]"
						},
						{
							"internalType": "string[][]",
							"name": "choices",
							"type": "string[][]"
						}
					],
					"internalType": "struct DeresyResolver.ReviewForm",
					"name": "reviewForm",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getReviewRequestsNames",
			"outputs": [
				{
					"internalType": "string[]",
					"name": "",
					"type": "string[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getWhitelistedTokens",
			"outputs": [
				{
					"internalType": "address[]",
					"name": "",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "isPayable",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "pure",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "tokenAddress",
					"type": "address"
				}
			],
			"name": "isTokenWhitelisted",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"components": [
						{
							"internalType": "bytes32",
							"name": "uid",
							"type": "bytes32"
						},
						{
							"internalType": "bytes32",
							"name": "schema",
							"type": "bytes32"
						},
						{
							"internalType": "uint64",
							"name": "time",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "expirationTime",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "revocationTime",
							"type": "uint64"
						},
						{
							"internalType": "bytes32",
							"name": "refUID",
							"type": "bytes32"
						},
						{
							"internalType": "address",
							"name": "recipient",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "attester",
							"type": "address"
						},
						{
							"internalType": "bool",
							"name": "revocable",
							"type": "bool"
						},
						{
							"internalType": "bytes",
							"name": "data",
							"type": "bytes"
						}
					],
					"internalType": "struct Attestation[]",
					"name": "attestations",
					"type": "tuple[]"
				},
				{
					"internalType": "uint256[]",
					"name": "values",
					"type": "uint256[]"
				}
			],
			"name": "multiAttest",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"components": [
						{
							"internalType": "bytes32",
							"name": "uid",
							"type": "bytes32"
						},
						{
							"internalType": "bytes32",
							"name": "schema",
							"type": "bytes32"
						},
						{
							"internalType": "uint64",
							"name": "time",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "expirationTime",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "revocationTime",
							"type": "uint64"
						},
						{
							"internalType": "bytes32",
							"name": "refUID",
							"type": "bytes32"
						},
						{
							"internalType": "address",
							"name": "recipient",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "attester",
							"type": "address"
						},
						{
							"internalType": "bool",
							"name": "revocable",
							"type": "bool"
						},
						{
							"internalType": "bytes",
							"name": "data",
							"type": "bytes"
						}
					],
					"internalType": "struct Attestation[]",
					"name": "attestations",
					"type": "tuple[]"
				},
				{
					"internalType": "uint256[]",
					"name": "values",
					"type": "uint256[]"
				}
			],
			"name": "multiRevoke",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "pause",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "paused",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "renounceOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "reviewsSchemaID",
			"outputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"components": [
						{
							"internalType": "bytes32",
							"name": "uid",
							"type": "bytes32"
						},
						{
							"internalType": "bytes32",
							"name": "schema",
							"type": "bytes32"
						},
						{
							"internalType": "uint64",
							"name": "time",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "expirationTime",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "revocationTime",
							"type": "uint64"
						},
						{
							"internalType": "bytes32",
							"name": "refUID",
							"type": "bytes32"
						},
						{
							"internalType": "address",
							"name": "recipient",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "attester",
							"type": "address"
						},
						{
							"internalType": "bool",
							"name": "revocable",
							"type": "bool"
						},
						{
							"internalType": "bytes",
							"name": "data",
							"type": "bytes"
						}
					],
					"internalType": "struct Attestation",
					"name": "attestation",
					"type": "tuple"
				}
			],
			"name": "revoke",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "_amendmentsSchemaID",
					"type": "bytes32"
				}
			],
			"name": "setAmendmentsSchemaID",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_callbackContractAddress",
					"type": "address"
				}
			],
			"name": "setCallbackContract",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "_reviewsSchemaID",
					"type": "bytes32"
				}
			],
			"name": "setReviewsSchemaID",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "unpause",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "tokenAddress",
					"type": "address"
				}
			],
			"name": "unwhitelistToken",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "version",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "tokenAddress",
					"type": "address"
				}
			],
			"name": "whitelistToken",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"stateMutability": "payable",
			"type": "receive"
		}
	],
}
