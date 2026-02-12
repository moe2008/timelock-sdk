// src/lib/timelock-idb.ts
export type StoredFileRecord = {
    key: string;        // timelock:file:<chainId>:<contract>:<listingId>
    name: string;
    mime: string;
    size: number;
    data: ArrayBuffer;  // raw bytes
    createdAt: number;
};

const DB_NAME = "timelock-content";
const DB_VERSION = 1;

const STORE_FILES = "files";

function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_FILES)) {
                db.createObjectStore(STORE_FILES, { keyPath: "key" });
            }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error("indexedDB open error"));
    });
}

export async function idbPutFile(rec: StoredFileRecord): Promise<void> {
    const db = await openDb();
    try {
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_FILES, "readwrite");
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error ?? new Error("tx error"));

            tx.objectStore(STORE_FILES).put(rec);
        });
    } finally {
        db.close();
    }
}

export async function idbGetFile(key: string): Promise<StoredFileRecord | null> {
    const db = await openDb();
    try {
        return await new Promise<StoredFileRecord | null>((resolve, reject) => {
            const tx = db.transaction(STORE_FILES, "readonly");
            const req = tx.objectStore(STORE_FILES).get(key);
            req.onsuccess = () => resolve((req.result as StoredFileRecord) ?? null);
            req.onerror = () => reject(req.error ?? new Error("get error"));
        });
    } finally {
        db.close();
    }
}

export async function idbDeleteFile(key: string): Promise<void> {
    const db = await openDb();
    try {
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_FILES, "readwrite");
            const req = tx.objectStore(STORE_FILES).delete(key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error ?? new Error("delete error"));
        });
    } finally {
        db.close();
    }
}
