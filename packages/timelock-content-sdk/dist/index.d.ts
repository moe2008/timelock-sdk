import { Hex, Address, Hash, PublicClient, WalletClient } from 'viem';

/**
 * Timelock Encryption Helper using drand
 * Simple XOR-based implementation for MVP
 * For production: use tlock-js library!
 */
declare class TimelockHelper {
    private static readonly QUICKNET_GENESIS;
    private static readonly QUICKNET_PERIOD;
    /**
     * Calculate drand round number for a given Unix timestamp
     * @param timestamp Unix timestamp in seconds
     * @returns drand round number
     */
    static getDrandRound(timestamp: bigint): bigint;
    /**
     * Get timestamp for a drand round
     * @param round drand round number
     * @returns Unix timestamp in seconds
     */
    static getTimestampForRound(round: bigint): bigint;
    /**
     * Encrypt key with drand round (simple XOR for MVP)
     * In production: use proper IBE from tlock-js
     * @param key Encryption key to protect
     * @param drandRound Target drand round
     * @returns Encrypted key as hex
     */
    static encryptWithRound(key: Uint8Array, drandRound: bigint): Promise<Hex>;
    /**
     * Decrypt key with drand round
     * @param encryptedKey Hex-encoded encrypted key
     * @param drandRound drand round number
     * @returns Decrypted key
     */
    static decryptWithRound(encryptedKey: Hex, drandRound: bigint): Promise<Uint8Array>;
    /**
     * Check if current time has passed the release time for a round
     * @param drandRound Target round
     * @returns true if round should be available
     */
    static isRoundReached(drandRound: bigint): boolean;
}

type ListingParsed = {
    seller: Address;
    price: bigint;
    releaseTime: bigint;
    revealDeadline: bigint;
    cipherUri: string;
    cipherHash: Hash;
    keyCommitment: Hash;
    keyRevealed: boolean;
    revealedKey: Hex;
    deposit: bigint;
    isTimelockEnabled: boolean;
    drandRound: bigint;
    timelockEncryptedKey: Hex;
};
type CreateListingArgs = {
    price: bigint;
    releaseTime: bigint;
    cipherUri: string;
    cipherHash: Hash;
    keyCommitment: Hash;
    revealGraceSeconds: bigint;
    deposit?: bigint;
    isTimelockEnabled?: boolean;
    drandRound?: bigint;
    timelockEncryptedKey?: Hex;
};
type BuyArgs = {
    listingId: bigint;
    price: bigint;
};
type RevealKeyArgs = {
    listingId: bigint;
    key: Uint8Array;
    salt: Hash;
};
type TxResult<T = undefined> = {
    txHash: Hash;
    receipt: any;
    data?: T;
};

declare function createTimeLockContentClient(cfg: {
    address: Address;
    publicClient: PublicClient;
    walletClient?: WalletClient;
}): {
    listingCount: () => Promise<bigint>;
    getListing: (listingId: bigint) => Promise<{
        seller: `0x${string}`;
        price: bigint;
        releaseTime: bigint;
        revealDeadline: bigint;
        cipherUri: string;
        cipherHash: `0x${string}`;
        keyCommitment: `0x${string}`;
        deposit: bigint;
        keyRevealed: boolean;
        revealedKey: `0x${string}`;
        isTimelockEnabled: boolean;
        drandRound: bigint;
        timelockEncryptedKey: `0x${string}`;
    }>;
    getListingParsed(listingId: bigint): Promise<ListingParsed>;
    purchased: (listingId: bigint, buyer: Address) => Promise<boolean>;
    refunded: (listingId: bigint, buyer: Address) => Promise<boolean>;
    createListing(args: CreateListingArgs): Promise<Hash>;
    buy(args: BuyArgs): Promise<Hash>;
    revealKey(args: RevealKeyArgs): Promise<Hash>;
    claimRefund(listingId: bigint): Promise<Hash>;
    createListingAndWait(args: CreateListingArgs): Promise<TxResult<{
        listingId: bigint;
    }>>;
    buyAndWait(args: BuyArgs): Promise<TxResult>;
    revealKeyAndWait(args: RevealKeyArgs): Promise<TxResult>;
    claimRefundAndWait(listingId: bigint): Promise<TxResult>;
};

declare function randomKey32(): Uint8Array;
declare function randomSalt32(): `0x${string}`;
declare function commitKey(key: Uint8Array, salt: Hash): Hash;
declare function nowSeconds(): bigint;
declare function canReveal(releaseTime: bigint, now?: bigint): boolean;
declare function canRefund(revealDeadline: bigint, keyRevealed: boolean, now?: bigint): boolean;
declare function canTimelockDecrypt(isTimelockEnabled: boolean, releaseTime: bigint, now?: bigint): boolean;
declare function parseListing(listing: any): ListingParsed;

type TimeLockErrorName = "NotFound" | "NotSeller" | "RevealTooEarly" | "AlreadyRevealed" | "BadReveal" | "WrongValue" | "AlreadyPurchased" | "NotPaidListing" | "RefundNotAvailable" | "AlreadyRefunded";
declare function decodeTimeLockError(err: any): TimeLockErrorName | null;

type AddressBook = Record<number, Address>;
declare const TIMELOCK_ADDRESSES: AddressBook;
declare function getTimelockAddress(chainId: number, book?: AddressBook): Address;

interface StorageAdapter {
    /**
     * Put ciphertext (encrypted file) somewhere and return a pointer/uri.
     * Example return: { uri: "ipfs://bafy..." } or https URL, ar:// etc.
     */
    put(data: Blob | Uint8Array): Promise<{
        uri: string;
    }>;
    /** Fetch ciphertext back */
    get(uri: string): Promise<Blob>;
}
/**
 * Minimal helper: normalize uri. You can keep it super simple.
 */
declare function normalizeUri(uri: string): string;

export { type AddressBook, type BuyArgs, type CreateListingArgs, type ListingParsed, type RevealKeyArgs, type StorageAdapter, TIMELOCK_ADDRESSES, type TimeLockErrorName, TimelockHelper, type TxResult, canRefund, canReveal, canTimelockDecrypt, commitKey, createTimeLockContentClient, decodeTimeLockError, getTimelockAddress, normalizeUri, nowSeconds, parseListing, randomKey32, randomSalt32 };
