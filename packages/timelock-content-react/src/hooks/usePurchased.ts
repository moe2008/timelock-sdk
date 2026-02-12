import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useTimeLockContent } from "./useTimeLockContent";

export function usePurchased(listingId?: bigint) {
    const { address: user } = useAccount();
    const { client, chainId } = useTimeLockContent();

    return useQuery({
        queryKey: ["timelock", "purchased", chainId, listingId?.toString(), user],
        enabled: !!listingId && !!user,
        queryFn: async () => {
            if (!listingId || !user) return false;
            return client.purchased(listingId, user);
        },
        staleTime: 15_000,
    });
}
