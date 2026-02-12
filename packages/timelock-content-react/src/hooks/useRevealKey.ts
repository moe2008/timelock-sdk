import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import type { RevealKeyArgs } from "@webdrei/timelock-content-sdk";
import { useTimeLockContent } from "./useTimeLockContent";

export function useRevealKey(opts?: { address?: Address }) {
    const qc = useQueryClient();
    const { client } = useTimeLockContent({ address: opts?.address });

    return useMutation({
        mutationFn: async (args: RevealKeyArgs) => client.revealKeyAndWait(args),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ["timelock"] });
        },
    });
}
