import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import { useTimeLockContent } from "./useTimeLockContent";
export function useAllListingsParsed(opts?: { address?: Address; enabled?: boolean }) {
    const { client } = useTimeLockContent({ address: opts?.address });

    return useQuery({
        queryKey: ["timelock", "allListingsParsed", opts?.address ?? "auto"],
        enabled: opts?.enabled ?? true,
        queryFn: async () => {
            console.log("🔍 Fetching all listings...");

            const count = await client.listingCount();
            console.log("📊 Total count:", count);

            const n = Number(count);

            try {
                const items = await Promise.all(
                    Array.from({ length: n }, (_, i) => {
                        console.log(`📥 Fetching listing ${i + 1}/${n}`);
                        return client.getListingParsed(BigInt(i + 1));
                    })
                );

                console.log("✅ All listings fetched:", items);
                return items.map((x, idx) => ({ ...x, listingId: BigInt(idx + 1) }));

            } catch (e) {
                console.error("❌ Error fetching listings:", e);
                throw e;
            }
        },
    });
}