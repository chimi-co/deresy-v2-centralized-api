module.exports = {
  DERESY_CONTRACT_ABI: [
    {
      inputs: [
        {
          internalType: 'contract IEAS',
          name: 'eas',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'AccessDenied',
      type: 'error',
    },
    {
      inputs: [],
      name: 'InsufficientValue',
      type: 'error',
    },
    {
      inputs: [],
      name: 'InvalidEAS',
      type: 'error',
    },
    {
      inputs: [],
      name: 'NotPayable',
      type: 'error',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'string',
          name: '_requestName',
          type: 'string',
        },
      ],
      name: 'ClosedReviewRequest',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: '_formId',
          type: 'uint256',
        },
      ],
      name: 'CreatedReviewForm',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'string',
          name: '_requestName',
          type: 'string',
        },
      ],
      name: 'CreatedReviewRequest',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'string',
          name: '_requestName',
          type: 'string',
        },
      ],
      name: 'SubmittedReview',
      type: 'event',
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'bytes32',
              name: 'uid',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 'schema',
              type: 'bytes32',
            },
            {
              internalType: 'uint64',
              name: 'time',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: 'expirationTime',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: 'revocationTime',
              type: 'uint64',
            },
            {
              internalType: 'bytes32',
              name: 'refUID',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'attester',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'revocable',
              type: 'bool',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          internalType: 'struct Attestation',
          name: 'attestation',
          type: 'tuple',
        },
      ],
      name: 'attest',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_name',
          type: 'string',
        },
      ],
      name: 'closeReviewRequest',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'contractVersion',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_name',
          type: 'string',
        },
        {
          internalType: 'address[]',
          name: 'reviewers',
          type: 'address[]',
        },
        {
          internalType: 'uint256[]',
          name: 'hypercertTargetIDs',
          type: 'uint256[]',
        },
        {
          internalType: 'string[]',
          name: 'targetsIPFSHashes',
          type: 'string[]',
        },
        {
          internalType: 'string',
          name: 'formIpfsHash',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'rewardPerReview',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'reviewFormIndex',
          type: 'uint256',
        },
      ],
      name: 'createRequest',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes32',
          name: 'easSchemaID',
          type: 'bytes32',
        },
        {
          internalType: 'string[]',
          name: 'questions',
          type: 'string[]',
        },
        {
          internalType: 'string[][]',
          name: 'choices',
          type: 'string[][]',
        },
        {
          internalType: 'enum DeresyResolver.QuestionType[]',
          name: 'questionTypes',
          type: 'uint8[]',
        },
      ],
      name: 'createReviewForm',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_name',
          type: 'string',
        },
      ],
      name: 'getRequest',
      outputs: [
        {
          internalType: 'address[]',
          name: 'reviewers',
          type: 'address[]',
        },
        {
          internalType: 'uint256[]',
          name: 'hypercertTargetIDs',
          type: 'uint256[]',
        },
        {
          internalType: 'string[]',
          name: 'targetsIPFSHashes',
          type: 'string[]',
        },
        {
          internalType: 'string',
          name: 'formIpfsHash',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'rewardPerReview',
          type: 'uint256',
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'reviewer',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'hypercertID',
              type: 'uint256',
            },
            {
              internalType: 'bytes32',
              name: 'attestationID',
              type: 'bytes32',
            },
          ],
          internalType: 'struct DeresyResolver.Review[]',
          name: 'reviews',
          type: 'tuple[]',
        },
        {
          internalType: 'uint256',
          name: 'reviewFormIndex',
          type: 'uint256',
        },
        {
          internalType: 'bool',
          name: 'isClosed',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: '_name',
          type: 'string',
        },
      ],
      name: 'getRequestReviewForm',
      outputs: [
        {
          internalType: 'string[]',
          name: '',
          type: 'string[]',
        },
        {
          internalType: 'enum DeresyResolver.QuestionType[]',
          name: '',
          type: 'uint8[]',
        },
        {
          internalType: 'string[][]',
          name: 'choices',
          type: 'string[][]',
        },
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_reviewFormIndex',
          type: 'uint256',
        },
      ],
      name: 'getReviewForm',
      outputs: [
        {
          internalType: 'string[]',
          name: '',
          type: 'string[]',
        },
        {
          internalType: 'enum DeresyResolver.QuestionType[]',
          name: '',
          type: 'uint8[]',
        },
        {
          internalType: 'string[][]',
          name: 'choices',
          type: 'string[][]',
        },
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getReviewRequestsNames',
      outputs: [
        {
          internalType: 'string[]',
          name: '',
          type: 'string[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'isPayable',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'bytes32',
              name: 'uid',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 'schema',
              type: 'bytes32',
            },
            {
              internalType: 'uint64',
              name: 'time',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: 'expirationTime',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: 'revocationTime',
              type: 'uint64',
            },
            {
              internalType: 'bytes32',
              name: 'refUID',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'attester',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'revocable',
              type: 'bool',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          internalType: 'struct Attestation[]',
          name: 'attestations',
          type: 'tuple[]',
        },
        {
          internalType: 'uint256[]',
          name: 'values',
          type: 'uint256[]',
        },
      ],
      name: 'multiAttest',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'bytes32',
              name: 'uid',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 'schema',
              type: 'bytes32',
            },
            {
              internalType: 'uint64',
              name: 'time',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: 'expirationTime',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: 'revocationTime',
              type: 'uint64',
            },
            {
              internalType: 'bytes32',
              name: 'refUID',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'attester',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'revocable',
              type: 'bool',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          internalType: 'struct Attestation[]',
          name: 'attestations',
          type: 'tuple[]',
        },
        {
          internalType: 'uint256[]',
          name: 'values',
          type: 'uint256[]',
        },
      ],
      name: 'multiRevoke',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'reviewFormsTotal',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: 'bytes32',
              name: 'uid',
              type: 'bytes32',
            },
            {
              internalType: 'bytes32',
              name: 'schema',
              type: 'bytes32',
            },
            {
              internalType: 'uint64',
              name: 'time',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: 'expirationTime',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: 'revocationTime',
              type: 'uint64',
            },
            {
              internalType: 'bytes32',
              name: 'refUID',
              type: 'bytes32',
            },
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'attester',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'revocable',
              type: 'bool',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
            },
          ],
          internalType: 'struct Attestation',
          name: 'attestation',
          type: 'tuple',
        },
      ],
      name: 'revoke',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'version',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      stateMutability: 'payable',
      type: 'receive',
    },
  ],
}
