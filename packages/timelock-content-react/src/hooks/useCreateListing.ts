import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import type { CreateListingArgs } from "@webdrei/timelock-content-sdk";
import { useTimeLockContent } from "./useTimeLockContent";

export function useCreateListing(opts?: { address?: Address }) {
    const qc = useQueryClient();
    const { client, address } = useTimeLockContent({ address: opts?.address });

    return useMutation({
        mutationFn: async (args: CreateListingArgs) => client.createListingAndWait(args),
        onSuccess: async () => {
            // optional: refresh list counts etc.
            await qc.invalidateQueries({ queryKey: ["timelock"] });
        },
    });
}
