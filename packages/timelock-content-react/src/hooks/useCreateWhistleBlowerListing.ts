// useCreateWhistleblowerListing.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import { TimelockHelper } from "@webdrei/timelock-content-sdk";
import { useTimeLockContent } from "./useTimeLockContent";

export interface CreateWhistleblowerListingArgs {
    releaseTime: bigint;
    cipherUri: string;
    cipherHash: `0x${string}`;
    encryptionKey: Uint8Array; // Will be timelock-encrypted automatically
    price?: bigint; // default: 0n
}

export function useCreateWhistleblowerListing(opts?: { address?: Address }) {
    const qc = useQueryClient();
    const { client } = useTimeLockContent({ address: opts?.address });

    return useMutation({
        mutationFn: async (args: CreateWhistleblowerListingArgs) => {
            // Auto-calculate drand round
            const drandRound = TimelockHelper.getDrandRound(args.releaseTime);

            // Auto-encrypt key
            const timelockEncryptedKey = await TimelockHelper.encryptWithRound(
                args.encryptionKey,
                drandRound
            );

            return client.createListingAndWait({
                price: args.price ?? 0n,
                releaseTime: args.releaseTime,
                cipherUri: args.cipherUri,
                cipherHash: args.cipherHash,
                keyCommitment: "0x0000000000000000000000000000000000000000000000000000000000000000",
                revealGraceSeconds: 0n,
                deposit: 0n,

                // Timelock enabled
                isTimelockEnabled: true,
                drandRound,
                timelockEncryptedKey
            });
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["timelock"] });
        },
    });
}