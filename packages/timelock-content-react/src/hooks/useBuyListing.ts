import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import type { BuyArgs } from "@webdrei/timelock-content-sdk";
import { useTimeLockContent } from "./useTimeLockContent";

export function useBuyListing(opts?: { address?: Address }) {
    const qc = useQueryClient();
    const { client } = useTimeLockContent({ address: opts?.address });

    return useMutation({
        mutationFn: async (args: BuyArgs) => client.buyAndWait(args),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["timelock"] });
        },
    });
}
