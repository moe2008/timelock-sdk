import { TIMELOCK_ABI } from "@/contracts/timelock-abi";
import { TIMELOCK_ADDRESS } from "../../contracts/adresses";
import { useReadContract, useWriteContract } from "wagmi";
import type { Address } from "viem";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

export function useCreateListing() {
    const { writeContractAsync, isPending, error } = useWriteContract();

    async function createListing(params: {
        priceWei: bigint;
        releaseTime: bigint;
        cipherUri: string;
        cipherHash: `0x${string}`;
        keyCommitment: `0x${string}`;
        revealGraceSeconds: bigint;
        depositWei?: bigint;
    }) {
        const {
            priceWei,
            releaseTime,
            cipherUri,
            cipherHash,
            keyCommitment,
            revealGraceSeconds,
            depositWei = BigInt(0),
        } = params;

        return writeContractAsync({
            address: TIMELOCK_ADDRESS as Address,
            abi: TIMELOCK_ABI,
            functionName: "createListing",
            args: [
                priceWei,
                releaseTime,
                cipherUri,
                cipherHash,
                keyCommitment,
                revealGraceSeconds,
            ],
            value: depositWei,
        });
    }

    return { createListing, isPending, error };
}

export function useBuyListing() {
    const { writeContractAsync, isPending, error } = useWriteContract();

    async function buyListing(params: { listingId: bigint; priceWei: bigint }) {
        return writeContractAsync({
            address: TIMELOCK_ADDRESS as Address,
            abi: TIMELOCK_ABI,
            functionName: "buy",
            args: [params.listingId],
            value: params.priceWei,
        });
    }

    return { buyListing, isPending, error };
}

export function useRevealKey() {
    const { writeContractAsync, isPending, error } = useWriteContract();

    async function revealKey(params: {
        listingId: bigint;
        key: `0x${string}`;
        salt: `0x${string}`;
    }) {
        return writeContractAsync({
            address: TIMELOCK_ADDRESS as Address,
            abi: TIMELOCK_ABI,
            functionName: "revealKey",
            args: [params.listingId, params.key, params.salt],
        });
    }

    return { revealKey, isPending, error };
}

export function useClaimRefund() {
    const { writeContractAsync, isPending, error } = useWriteContract();

    async function claimRefund(listingId: bigint) {
        return writeContractAsync({
            address: TIMELOCK_ADDRESS as Address,
            abi: TIMELOCK_ABI,
            functionName: "claimRefund",
            args: [listingId],
        });
    }

    return { claimRefund, isPending, error };
}

export function useListingCount() {
    return useReadContract({
        address: TIMELOCK_ADDRESS as Address,
        abi: TIMELOCK_ABI,
        functionName: "listingCount",
    });
}

export function useGetListing(listingId?: bigint) {
    return useReadContract({
        address: TIMELOCK_ADDRESS as Address,
        abi: TIMELOCK_ABI,
        functionName: "getListing",
        args: listingId !== undefined ? [listingId] : undefined,
        query: { enabled: listingId !== undefined },
    });
}

/**
 * Hook to fetch all listings from the blockchain
 * 
 * IMPORTANT: Your contract uses 1-based indexing!
 * - First listing has ID 1 (not 0)
 * - listingCount returns the highest assigned ID
 * - We fetch from ID 1 to listingCount (inclusive)
 */
export function useAllListings() {
    const publicClient = usePublicClient();
    const { data: listingCount, refetch: refetchCount } = useListingCount();

    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchAllListings() {
            if (!publicClient) {
                setListings([]);
                return;
            }

            // listingCount is the highest listing ID, or 0 if no listings exist
            const count = listingCount ? Number(listingCount) : 0;

            // If count is 0, no listings exist yet
            if (count === 0) {
                setListings([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const listingPromises = [];

                // Contract uses 1-based indexing: fetch from 1 to listingCount (inclusive)
                for (let i = 1; i <= count; i++) {
                    listingPromises.push(
                        publicClient.readContract({
                            address: TIMELOCK_ADDRESS as Address,
                            abi: TIMELOCK_ABI,
                            functionName: "getListing",
                            args: [BigInt(i)],
                        }).catch(err => {
                            console.warn(`Failed to fetch listing ${i}:`, err.message);
                            return null; // Return null for failed listings
                        })
                    );
                }

                const results = await Promise.all(listingPromises);

                // Filter out null results and transform to include listingId
                const validListings = results
                    .map((listing, index) => {
                        if (!listing) return null;

                        // listing is a tuple from the contract, destructure it
                        const [
                            seller,
                            price,
                            releaseTime,
                            revealDeadline,
                            cipherUri,
                            cipherHash,
                            keyCommitment,
                            keyRevealed,
                            revealedKey,
                            deposit
                        ] = listing;

                        return {
                            listingId: BigInt(index + 1), // 1-based
                            seller,
                            price,
                            releaseTime,
                            revealDeadline,
                            cipherUri,
                            cipherHash,
                            keyCommitment,
                            keyRevealed,
                            revealedKey,
                            deposit,
                            // For convenience, also include the raw tuple
                            _raw: listing
                        };
                    })
                    .filter(Boolean); // Remove null entries

                setListings(validListings);
            } catch (err) {
                console.error("Error fetching listings:", err);
                setError(err instanceof Error ? err : new Error("Failed to fetch listings"));
                setListings([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllListings();
    }, [publicClient, listingCount]);

    const refetch = async () => {
        await refetchCount();
    };

    return { listings, isLoading, error, refetch };
}

/**
 * Hook to fetch multiple specific listings by their IDs
 */
export function useListingsByIds(listingIds: bigint[]) {
    const publicClient = usePublicClient();

    const [listings, setListings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchListings() {
            if (!publicClient || listingIds.length === 0) {
                setListings([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const listingPromises = listingIds.map((id) =>
                    publicClient.readContract({
                        address: TIMELOCK_ADDRESS as Address,
                        abi: TIMELOCK_ABI,
                        functionName: "getListing",
                        args: [id],
                    }).catch(err => {
                        console.warn(`Failed to fetch listing ${id}:`, err.message);
                        return null;
                    })
                );

                const results = await Promise.all(listingPromises);

                const listingsWithIds = results
                    .map((listing, index) => {
                        if (!listing) return null;

                        const [
                            seller,
                            price,
                            releaseTime,
                            revealDeadline,
                            cipherUri,
                            cipherHash,
                            keyCommitment,
                            keyRevealed,
                            revealedKey,
                            deposit
                        ] = listing;

                        return {
                            listingId: listingIds[index],
                            seller,
                            price,
                            releaseTime,
                            revealDeadline,
                            cipherUri,
                            cipherHash,
                            keyCommitment,
                            keyRevealed,
                            revealedKey,
                            deposit,
                            _raw: listing
                        };
                    })
                    .filter(Boolean);

                setListings(listingsWithIds);
            } catch (err) {
                console.error("Error fetching listings:", err);
                setError(err instanceof Error ? err : new Error("Failed to fetch listings"));
                setListings([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchListings();
    }, [publicClient, JSON.stringify(listingIds)]);

    return { listings, isLoading, error };
}