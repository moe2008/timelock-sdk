// src/timelock.ts
import { toHex } from "viem";
var TimelockHelper = class {
  // seconds per round
  /**
   * Calculate drand round number for a given Unix timestamp
   * @param timestamp Unix timestamp in seconds
   * @returns drand round number
   */
  static getDrandRound(timestamp) {
    if (timestamp <= this.QUICKNET_GENESIS) {
      throw new Error("Timestamp must be after drand quicknet genesis (Aug 2023)");
    }
    return (timestamp - this.QUICKNET_GENESIS) / this.QUICKNET_PERIOD;
  }
  /**
   * Get timestamp for a drand round
   * @param round drand round number
   * @returns Unix timestamp in seconds
   */
  static getTimestampForRound(round) {
    return this.QUICKNET_GENESIS + round * this.QUICKNET_PERIOD;
  }
  /**
   * Encrypt key with drand round (simple XOR for MVP)
   * In production: use proper IBE from tlock-js
   * @param key Encryption key to protect
   * @param drandRound Target drand round
   * @returns Encrypted key as hex
   */
  static async encryptWithRound(key, drandRound) {
    const roundBytes = new TextEncoder().encode(drandRound.toString());
    const derivedKeyBuf = await crypto.subtle.digest("SHA-256", roundBytes);
    const derivedKey = new Uint8Array(derivedKeyBuf);
    const encrypted = new Uint8Array(key.length);
    for (let i = 0; i < key.length; i++) {
      encrypted[i] = key[i] ^ derivedKey[i % derivedKey.length];
    }
    return toHex(encrypted);
  }
  /**
   * Decrypt key with drand round
   * @param encryptedKey Hex-encoded encrypted key
   * @param drandRound drand round number
   * @returns Decrypted key
   */
  static async decryptWithRound(encryptedKey, drandRound) {
    const roundBytes = new TextEncoder().encode(drandRound.toString());
    const derivedKeyBuf = await crypto.subtle.digest("SHA-256", roundBytes);
    const derivedKey = new Uint8Array(derivedKeyBuf);
    const encrypted = new Uint8Array(
      encryptedKey.slice(2).match(/.{1,2}/g).map((b) => parseInt(b, 16))
    );
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ derivedKey[i % derivedKey.length];
    }
    return decrypted;
  }
  /**
   * Check if current time has passed the release time for a round
   * @param drandRound Target round
   * @returns true if round should be available
   */
  static isRoundReached(drandRound) {
    const now = BigInt(Math.floor(Date.now() / 1e3));
    const roundTime = this.getTimestampForRound(drandRound);
    return now >= roundTime;
  }
};
// drand quicknet constants
TimelockHelper.QUICKNET_GENESIS = 1692803367n;
// Unix timestamp (Aug 2023)
TimelockHelper.QUICKNET_PERIOD = 3n;

// src/client.ts
import { getContract, parseEventLogs, toHex as toHex3 } from "viem";
import { ABI as timeLockContentAbi } from "@webdrei/timelock-content-contracts";

// src/helpers.ts
import { keccak256, concat, toHex as toHex2 } from "viem";
function randomKey32() {
  const key = new Uint8Array(32);
  crypto.getRandomValues(key);
  return key;
}
function randomSalt32() {
  const salt = new Uint8Array(32);
  crypto.getRandomValues(salt);
  return toHex2(salt);
}
function commitKey(key, salt) {
  return keccak256(concat([toHex2(key), salt]));
}
function nowSeconds() {
  return BigInt(Math.floor(Date.now() / 1e3));
}
function canReveal(releaseTime, now = nowSeconds()) {
  return now >= releaseTime;
}
function canRefund(revealDeadline, keyRevealed, now = nowSeconds()) {
  return !keyRevealed && now > revealDeadline;
}
function canTimelockDecrypt(isTimelockEnabled, releaseTime, now = nowSeconds()) {
  return isTimelockEnabled && now >= releaseTime;
}
function parseListing(listing) {
  return {
    seller: listing.seller,
    price: BigInt(listing.price),
    releaseTime: BigInt(listing.releaseTime),
    revealDeadline: BigInt(listing.revealDeadline),
    cipherUri: listing.cipherUri,
    cipherHash: listing.cipherHash,
    keyCommitment: listing.keyCommitment,
    keyRevealed: listing.keyRevealed,
    revealedKey: listing.revealedKey ?? "0x",
    deposit: BigInt(listing.deposit),
    // 🔥 Timelock fields
    isTimelockEnabled: listing.isTimelockEnabled ?? false,
    drandRound: BigInt(listing.drandRound ?? 0),
    timelockEncryptedKey: listing.timelockEncryptedKey ?? "0x"
  };
}

// src/client.ts
function createTimeLockContentClient(cfg) {
  const readContract = getContract({
    address: cfg.address,
    abi: timeLockContentAbi,
    client: { public: cfg.publicClient }
  });
  const writeContract = cfg.walletClient ? getContract({
    address: cfg.address,
    abi: timeLockContentAbi,
    client: { wallet: cfg.walletClient }
  }) : null;
  const requireWrite = () => {
    if (!writeContract) throw new Error("walletClient required for write calls");
    return writeContract;
  };
  function getListingCreatedFromReceipt(receipt) {
    const logs = parseEventLogs({
      abi: timeLockContentAbi,
      eventName: "ListingCreated",
      logs: receipt.logs ?? []
    });
    const first = logs?.[0];
    if (!first) return null;
    return { listingId: BigInt(first.args.listingId) };
  }
  return {
    // ---------- READ ----------
    listingCount: () => readContract.read.listingCount(),
    getListing: (listingId) => readContract.read.getListing([listingId]),
    async getListingParsed(listingId) {
      const listing = await readContract.read.getListing([listingId]);
      return parseListing(listing);
    },
    purchased: (listingId, buyer) => readContract.read.purchased([listingId, buyer]),
    refunded: (listingId, buyer) => readContract.read.refunded([listingId, buyer]),
    // ---------- WRITE (txHash) ----------
    async createListing(args) {
      const c = requireWrite();
      const isTimelockEnabled = args.isTimelockEnabled ?? false;
      const drandRound = args.drandRound ?? 0n;
      const timelockEncryptedKey = args.timelockEncryptedKey ?? "0x";
      return c.write.createListing(
        [
          args.price,
          args.releaseTime,
          args.cipherUri,
          args.cipherHash,
          args.keyCommitment,
          args.revealGraceSeconds,
          isTimelockEnabled,
          drandRound,
          timelockEncryptedKey
        ],
        {
          value: args.deposit ?? 0n,
          account: cfg.walletClient?.account ?? null,
          chain: cfg.walletClient?.chain ?? null
        }
      );
    },
    async buy(args) {
      const c = requireWrite();
      return c.write.buy(
        [args.listingId],
        {
          value: args.price,
          account: cfg.walletClient?.account ?? null,
          chain: cfg.walletClient?.chain ?? null
        }
      );
    },
    async revealKey(args) {
      const c = requireWrite();
      const keyHex = toHex3(args.key);
      return c.write.revealKey(
        [args.listingId, keyHex, args.salt],
        {
          account: cfg.walletClient?.account ?? null,
          chain: cfg.walletClient?.chain ?? null
        }
      );
    },
    async claimRefund(listingId) {
      const c = requireWrite();
      return c.write.claimRefund(
        [listingId],
        {
          account: cfg.walletClient?.account ?? null,
          chain: cfg.walletClient?.chain ?? null
        }
      );
    },
    // ---------- WRITE + WAIT (receipt + parsed data) ----------
    async createListingAndWait(args) {
      const txHash = await this.createListing(args);
      const receipt = await cfg.publicClient.waitForTransactionReceipt({ hash: txHash });
      const ev = getListingCreatedFromReceipt(receipt);
      if (!ev) throw new Error("ListingCreated event not found in receipt");
      return { txHash, receipt, data: ev };
    },
    async buyAndWait(args) {
      const txHash = await this.buy(args);
      const receipt = await cfg.publicClient.waitForTransactionReceipt({ hash: txHash });
      return { txHash, receipt };
    },
    async revealKeyAndWait(args) {
      const txHash = await this.revealKey(args);
      const receipt = await cfg.publicClient.waitForTransactionReceipt({ hash: txHash });
      return { txHash, receipt };
    },
    async claimRefundAndWait(listingId) {
      const txHash = await this.claimRefund(listingId);
      const receipt = await cfg.publicClient.waitForTransactionReceipt({ hash: txHash });
      return { txHash, receipt };
    }
  };
}

// src/errors.ts
import { decodeErrorResult } from "viem";
import { ABI as timeLockContentAbi2 } from "@webdrei/timelock-content-contracts";
function decodeTimeLockError(err) {
  const data = err?.data ?? err?.cause?.data ?? err?.cause?.cause?.data;
  if (!data) return null;
  try {
    const decoded = decodeErrorResult({ abi: timeLockContentAbi2, data });
    return decoded.errorName;
  } catch {
    return null;
  }
}

// src/addresses.ts
var TIMELOCK_ADDRESSES = {
  // 11155111: "0x..." as Address, // Sepolia
  // 1: "0x..." as Address,        // Mainnet
  31337: "0x5fbdb2315678afecb367f032d93f642f64180aa3"
  // Local
};
function getTimelockAddress(chainId, book = TIMELOCK_ADDRESSES) {
  const addr = book[chainId];
  if (!addr) throw new Error(`No TimeLockContent address configured for chainId=${chainId}`);
  return addr;
}

// src/storage.ts
function normalizeUri(uri) {
  return uri.trim();
}
export {
  TIMELOCK_ADDRESSES,
  TimelockHelper,
  canRefund,
  canReveal,
  canTimelockDecrypt,
  commitKey,
  createTimeLockContentClient,
  decodeTimeLockError,
  getTimelockAddress,
  normalizeUri,
  nowSeconds,
  parseListing,
  randomKey32,
  randomSalt32
};
//# sourceMappingURL=index.js.map