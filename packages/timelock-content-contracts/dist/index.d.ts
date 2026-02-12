declare const ABI: readonly [{
    readonly inputs: readonly [];
    readonly name: "AlreadyPurchased";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "AlreadyRefunded";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "AlreadyRevealed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "BadReveal";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotPaidListing";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotSeller";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "RefundNotAvailable";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "RevealTooEarly";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "WrongValue";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "listingId";
        readonly type: "uint256";
    }];
    readonly name: "KeyRevealed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "listingId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "seller";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "releaseTime";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "bool";
        readonly name: "isTimelockEnabled";
        readonly type: "bool";
    }];
    readonly name: "ListingCreated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "listingId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "buyer";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "Purchased";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "listingId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "buyer";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "Refunded";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "listingId";
        readonly type: "uint256";
    }];
    readonly name: "buy";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "listingId";
        readonly type: "uint256";
    }];
    readonly name: "claimRefund";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint96";
        readonly name: "price";
        readonly type: "uint96";
    }, {
        readonly internalType: "uint64";
        readonly name: "releaseTime";
        readonly type: "uint64";
    }, {
        readonly internalType: "string";
        readonly name: "cipherUri";
        readonly type: "string";
    }, {
        readonly internalType: "bytes32";
        readonly name: "cipherHash";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "keyCommitment";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint64";
        readonly name: "revealGraceSeconds";
        readonly type: "uint64";
    }, {
        readonly internalType: "bool";
        readonly name: "isTimelockEnabled";
        readonly type: "bool";
    }, {
        readonly internalType: "uint64";
        readonly name: "drandRound";
        readonly type: "uint64";
    }, {
        readonly internalType: "bytes";
        readonly name: "timelockEncryptedKey";
        readonly type: "bytes";
    }];
    readonly name: "createListing";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "listingId";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "listingId";
        readonly type: "uint256";
    }];
    readonly name: "getListing";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "seller";
            readonly type: "address";
        }, {
            readonly internalType: "uint96";
            readonly name: "price";
            readonly type: "uint96";
        }, {
            readonly internalType: "uint64";
            readonly name: "releaseTime";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "revealDeadline";
            readonly type: "uint64";
        }, {
            readonly internalType: "string";
            readonly name: "cipherUri";
            readonly type: "string";
        }, {
            readonly internalType: "bytes32";
            readonly name: "cipherHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "keyCommitment";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint96";
            readonly name: "deposit";
            readonly type: "uint96";
        }, {
            readonly internalType: "bool";
            readonly name: "keyRevealed";
            readonly type: "bool";
        }, {
            readonly internalType: "bytes";
            readonly name: "revealedKey";
            readonly type: "bytes";
        }, {
            readonly internalType: "bool";
            readonly name: "isTimelockEnabled";
            readonly type: "bool";
        }, {
            readonly internalType: "uint64";
            readonly name: "drandRound";
            readonly type: "uint64";
        }, {
            readonly internalType: "bytes";
            readonly name: "timelockEncryptedKey";
            readonly type: "bytes";
        }];
        readonly internalType: "struct TimeLockContent.Listing";
        readonly name: "";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "listingCount";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly name: "listings";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "seller";
        readonly type: "address";
    }, {
        readonly internalType: "uint96";
        readonly name: "price";
        readonly type: "uint96";
    }, {
        readonly internalType: "uint64";
        readonly name: "releaseTime";
        readonly type: "uint64";
    }, {
        readonly internalType: "uint64";
        readonly name: "revealDeadline";
        readonly type: "uint64";
    }, {
        readonly internalType: "string";
        readonly name: "cipherUri";
        readonly type: "string";
    }, {
        readonly internalType: "bytes32";
        readonly name: "cipherHash";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "keyCommitment";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint96";
        readonly name: "deposit";
        readonly type: "uint96";
    }, {
        readonly internalType: "bool";
        readonly name: "keyRevealed";
        readonly type: "bool";
    }, {
        readonly internalType: "bytes";
        readonly name: "revealedKey";
        readonly type: "bytes";
    }, {
        readonly internalType: "bool";
        readonly name: "isTimelockEnabled";
        readonly type: "bool";
    }, {
        readonly internalType: "uint64";
        readonly name: "drandRound";
        readonly type: "uint64";
    }, {
        readonly internalType: "bytes";
        readonly name: "timelockEncryptedKey";
        readonly type: "bytes";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly name: "purchased";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly name: "refunded";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "listingId";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "key";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes32";
        readonly name: "salt";
        readonly type: "bytes32";
    }];
    readonly name: "revealKey";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];

export { ABI };
