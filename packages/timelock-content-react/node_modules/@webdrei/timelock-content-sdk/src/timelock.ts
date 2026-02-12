import { toHex, type Hex } from "viem";

/**
 * Timelock Encryption Helper using drand
 * Simple XOR-based implementation for MVP
 * For production: use tlock-js library!
 */
export class TimelockHelper {
    // drand quicknet constants
    private static readonly QUICKNET_GENESIS = 1692803367n; // Unix timestamp (Aug 2023)
    private static readonly QUICKNET_PERIOD = 3n; // seconds per round

    /**
     * Calculate drand round number for a given Unix timestamp
     * @param timestamp Unix timestamp in seconds
     * @returns drand round number
     */
    static getDrandRound(timestamp: bigint): bigint {
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
    static getTimestampForRound(round: bigint): bigint {
        return this.QUICKNET_GENESIS + (round * this.QUICKNET_PERIOD);
    }

    /**
     * Encrypt key with drand round (simple XOR for MVP)
     * In production: use proper IBE from tlock-js
     * @param key Encryption key to protect
     * @param drandRound Target drand round
     * @returns Encrypted key as hex
     */
    static async encryptWithRound(
        key: Uint8Array,
        drandRound: bigint
    ): Promise<Hex> {
        // Derive encryption key from round number
        const roundBytes = new TextEncoder().encode(drandRound.toString());
        const derivedKeyBuf = await crypto.subtle.digest("SHA-256", roundBytes);
        const derivedKey = new Uint8Array(derivedKeyBuf);

        // XOR encryption (simple but deterministic)
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
    static async decryptWithRound(
        encryptedKey: Hex,
        drandRound: bigint
    ): Promise<Uint8Array> {
        // Derive decryption key (same as encryption)
        const roundBytes = new TextEncoder().encode(drandRound.toString());
        const derivedKeyBuf = await crypto.subtle.digest("SHA-256", roundBytes);
        const derivedKey = new Uint8Array(derivedKeyBuf);

        // Convert hex to bytes
        const encrypted = new Uint8Array(
            encryptedKey.slice(2).match(/.{1,2}/g)!.map(b => parseInt(b, 16))
        );

        // XOR decryption (same operation as encryption)
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
    static isRoundReached(drandRound: bigint): boolean {
        const now = BigInt(Math.floor(Date.now() / 1000));
        const roundTime = this.getTimestampForRound(drandRound);
        return now >= roundTime;
    }
}