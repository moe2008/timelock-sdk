import type { Address, Hash, Hex } from "viem";

export type ListingParsed = {
    seller: Address;
    price: bigint;
    releaseTime: bigint;
    revealDeadline: bigint;
    cipherUri: string;
    cipherHash: Hash;
    keyCommitment: Hash;
    keyRevealed: boolean;
    revealedKey: Hex;      // bytes -> 0x...
    deposit: bigint;

    // 🔥 NEU: Timelock fields
    isTimelockEnabled: boolean;
    drandRound: bigint;    // uint64
    timelockEncryptedKey: Hex; // bytes -> 0x...
};

export type CreateListingArgs = {
    price: bigint;               // uint96
    releaseTime: bigint;         // uint64 unix seconds
    cipherUri: string;
    cipherHash: Hash;
    keyCommitment: Hash;
    revealGraceSeconds: bigint;  // uint64
    deposit?: bigint;            // msg.value

    // 🔥 NEU: Timelock fields (optional)
    isTimelockEnabled?: boolean;
    drandRound?: bigint;         // uint64
    timelockEncryptedKey?: Hex;  // bytes
};

export type BuyArgs = {
    listingId: bigint;
    price: bigint;               // msg.value
};

export type RevealKeyArgs = {
    listingId: bigint;
    key: Uint8Array;             // will be converted to Hex
    salt: Hash;                  // bytes32
};

export type TxResult<T = undefined> = {
    txHash: Hash;
    receipt: any;                // viem TransactionReceipt type (optional)
    data?: T;
};