import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import { useTimeLockContent } from "./useTimeLockContent";

export function useListing(listingId: bigint | undefined, opts?: { address?: Address; enabled?: boolean }) {
    const { client } = useTimeLockContent({ address: opts?.address });

    return useQuery({
        queryKey: ["timelock", "listing", opts?.address ?? "auto", listingId?.toString()],
        enabled: Boolean(listingId) && (opts?.enabled ?? true),
        queryFn: async () => client.getListing(listingId!),
    });
}
