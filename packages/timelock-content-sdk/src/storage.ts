export interface StorageAdapter {
    /**
     * Put ciphertext (encrypted file) somewhere and return a pointer/uri.
     * Example return: { uri: "ipfs://bafy..." } or https URL, ar:// etc.
     */
    put(data: Blob | Uint8Array): Promise<{ uri: string }>;

    /** Fetch ciphertext back */
    get(uri: string): Promise<Blob>;
}

/**
 * Minimal helper: normalize uri. You can keep it super simple.
 */
export function normalizeUri(uri: string): string {
    return uri.trim();
}
