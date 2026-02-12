export const TIMELOCK_ABI = [
    {
        "inputs": [],
        "name": "AlreadyPurchased",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "AlreadyRefunded",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "AlreadyRevealed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "BadReveal",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotFound",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotPaidListing",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotSeller",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "RefundNotAvailable",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "RevealTooEarly",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "WrongValue",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            }
        ],
        "name": "KeyRevealed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "releaseTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "revealDeadline",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "cipherUri",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "cipherHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "keyCommitment",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "deposit",
                "type": "uint256"
            }
        ],
        "name": "ListingCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Purchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Refunded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            }
        ],
        "name": "buy",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            }
        ],
        "name": "claimRefund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint96",
                "name": "price",
                "type": "uint96"
            },
            {
                "internalType": "uint64",
                "name": "releaseTime",
                "type": "uint64"
            },
            {
                "internalType": "string",
                "name": "cipherUri",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "cipherHash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "keyCommitment",
                "type": "bytes32"
            },
            {
                "internalType": "uint64",
                "name": "revealGraceSeconds",
                "type": "uint64"
            }
        ],
        "name": "createListing",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            }
        ],
        "name": "getListing",
        "outputs": [
            {
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "releaseTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "revealDeadline",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "cipherUri",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "cipherHash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "keyCommitment",
                "type": "bytes32"
            },
            {
                "internalType": "bool",
                "name": "keyRevealed",
                "type": "bool"
            },
            {
                "internalType": "bytes",
                "name": "revealedKey",
                "type": "bytes"
            },
            {
                "internalType": "uint256",
                "name": "deposit",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "listingCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "listings",
        "outputs": [
            {
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "internalType": "uint96",
                "name": "price",
                "type": "uint96"
            },
            {
                "internalType": "uint64",
                "name": "releaseTime",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "revealDeadline",
                "type": "uint64"
            },
            {
                "internalType": "string",
                "name": "cipherUri",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "cipherHash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "keyCommitment",
                "type": "bytes32"
            },
            {
                "internalType": "uint96",
                "name": "deposit",
                "type": "uint96"
            },
            {
                "internalType": "bool",
                "name": "keyRevealed",
                "type": "bool"
            },
            {
                "internalType": "bytes",
                "name": "revealedKey",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "purchased",
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
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "refunded",
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
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "key",
                "type": "bytes"
            },
            {
                "internalType": "bytes32",
                "name": "salt",
                "type": "bytes32"
            }
        ],
        "name": "revealKey",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
] as const;