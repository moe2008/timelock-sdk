import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import { useTimeLockContent } from "./useTimeLockContent";

export function useClaimRefund(opts?: { address?: Address }) {
    const qc = useQueryClient();
    const { client } = useTimeLockContent({ address: opts?.address });

    return useMutation({
        mutationFn: async (listingId: bigint) => client.claimRefundAndWait(listingId),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["timelock"] });
        },
    });
}
