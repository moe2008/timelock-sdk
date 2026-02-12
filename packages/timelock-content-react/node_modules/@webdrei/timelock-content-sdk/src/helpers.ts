import type { Hash, Hex } from "viem";
import { keccak256, concat, toHex } from "viem";
import type { ListingParsed } from "./types.js";

export function randomKey32(): Uint8Array {
    const key = new Uint8Array(32);
    crypto.getRandomValues(key);
    return key;
}

export function randomSalt32(): `0x${string}` {
    const salt = new Uint8Array(32);
    crypto.getRandomValues(salt);
    return toHex(salt) as `0x${string}`;
}

export function commitKey(key: Uint8Array, salt: Hash): Hash {
    // keccak256(abi.encodePacked(key, salt))
    return keccak256(concat([toHex(key), salt]));
}

export function nowSeconds(): bigint {
    return BigInt(Math.floor(Date.now() / 1000));
}

export function canReveal(releaseTime: bigint, now: bigint = nowSeconds()): boolean {
    return now >= releaseTime;
}

export function canRefund(revealDeadline: bigint, keyRevealed: boolean, now: bigint = nowSeconds()): boolean {
    return !keyRevealed && now > revealDeadline;
}

// 🔥 NEU: Check if timelock key is decryptable
export function canTimelockDecrypt(
    isTimelockEnabled: boolean,
    releaseTime: bigint,
    now: bigint = nowSeconds()
): boolean {
    return isTimelockEnabled && now >= releaseTime;
}

export function parseListing(listing: any): ListingParsed {
    // 🔥 Object destructuring für Struct
    return {
        seller: listing.seller,
        price: BigInt(listing.price),
        releaseTime: BigInt(listing.releaseTime),
        revealDeadline: BigInt(listing.revealDeadline),
        cipherUri: listing.cipherUri,
        cipherHash: listing.cipherHash,
        keyCommitment: listing.keyCommitment,
        keyRevealed: listing.keyRevealed,
        revealedKey: (listing.revealedKey ?? "0x") as Hex,
        deposit: BigInt(listing.deposit),

        // 🔥 Timelock fields
        isTimelockEnabled: listing.isTimelockEnabled ?? false,
        drandRound: BigInt(listing.drandRound ?? 0),
        timelockEncryptedKey: (listing.timelockEncryptedKey ?? "0x") as Hex,
    };
}