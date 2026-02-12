// src/hooks/useTimeLockContent.ts
import { useMemo } from "react";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";
import { createTimeLockContentClient, getTimelockAddress } from "@webdrei/timelock-content-sdk";
function useTimeLockContent(opts) {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  if (!publicClient) throw new Error("No publicClient (wagmi config missing?)");
  const { data: walletClient } = useWalletClient();
  const address = opts?.address ?? getTimelockAddress(chainId);
  const client = useMemo(() => {
    return createTimeLockContentClient({
      address,
      publicClient,
      walletClient: walletClient ?? void 0
    });
  }, [address, publicClient, walletClient]);
  return { client, address, chainId, publicClient, walletClient };
}

// src/hooks/useListing.ts
import { useQuery } from "@tanstack/react-query";
function useListing(listingId, opts) {
  const { client } = useTimeLockContent({ address: opts?.address });
  return useQuery({
    queryKey: ["timelock", "listing", opts?.address ?? "auto", listingId?.toString()],
    enabled: Boolean(listingId) && (opts?.enabled ?? true),
    queryFn: async () => client.getListing(listingId)
  });
}

// src/hooks/useListingParsed.ts
import { useQuery as useQuery2 } from "@tanstack/react-query";
function useListingParsed(listingId, opts) {
  const { client } = useTimeLockContent({ address: opts?.address });
  return useQuery2({
    queryKey: ["timelock", "listingParsed", opts?.address ?? "auto", listingId?.toString()],
    enabled: Boolean(listingId) && (opts?.enabled ?? true),
    queryFn: async () => client.getListingParsed(listingId)
  });
}

// src/hooks/useCreateListing.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
function useCreateListing(opts) {
  const qc = useQueryClient();
  const { client, address } = useTimeLockContent({ address: opts?.address });
  return useMutation({
    mutationFn: async (args) => client.createListingAndWait(args),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["timelock"] });
    }
  });
}

// src/hooks/useBuyListing.ts
import { useMutation as useMutation2, useQueryClient as useQueryClient2 } from "@tanstack/react-query";
function useBuyListing(opts) {
  const qc = useQueryClient2();
  const { client } = useTimeLockContent({ address: opts?.address });
  return useMutation2({
    mutationFn: async (args) => client.buyAndWait(args),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["timelock"] });
    }
  });
}

// src/hooks/useRevealKey.ts
import { useMutation as useMutation3, useQueryClient as useQueryClient3 } from "@tanstack/react-query";
function useRevealKey(opts) {
  const qc = useQueryClient3();
  const { client } = useTimeLockContent({ address: opts?.address });
  return useMutation3({
    mutationFn: async (args) => client.revealKeyAndWait(args),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["timelock"] });
    }
  });
}

// src/hooks/useClaimRefund.ts
import { useMutation as useMutation4, useQueryClient as useQueryClient4 } from "@tanstack/react-query";
function useClaimRefund(opts) {
  const qc = useQueryClient4();
  const { client } = useTimeLockContent({ address: opts?.address });
  return useMutation4({
    mutationFn: async (listingId) => client.claimRefundAndWait(listingId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["timelock"] });
    }
  });
}

// src/hooks/useAllListingsParsed.ts
import { useQuery as useQuery3 } from "@tanstack/react-query";
function useAllListingsParsed(opts) {
  const { client } = useTimeLockContent({ address: opts?.address });
  return useQuery3({
    queryKey: ["timelock", "allListingsParsed", opts?.address ?? "auto"],
    enabled: opts?.enabled ?? true,
    queryFn: async () => {
      console.log("\u{1F50D} Fetching all listings...");
      const count = await client.listingCount();
      console.log("\u{1F4CA} Total count:", count);
      const n = Number(count);
      try {
        const items = await Promise.all(
          Array.from({ length: n }, (_, i) => {
            console.log(`\u{1F4E5} Fetching listing ${i + 1}/${n}`);
            return client.getListingParsed(BigInt(i + 1));
          })
        );
        console.log("\u2705 All listings fetched:", items);
        return items.map((x, idx) => ({ ...x, listingId: BigInt(idx + 1) }));
      } catch (e) {
        console.error("\u274C Error fetching listings:", e);
        throw e;
      }
    }
  });
}

// src/hooks/useRefunded.ts
import { useQuery as useQuery4 } from "@tanstack/react-query";
import { useAccount } from "wagmi";
function useRefunded(listingId) {
  const { address: user } = useAccount();
  const { client, chainId } = useTimeLockContent();
  return useQuery4({
    queryKey: ["timelock", "refunded", chainId, listingId?.toString(), user],
    enabled: !!listingId && !!user,
    queryFn: async () => {
      if (!listingId || !user) return false;
      return client.refunded(listingId, user);
    },
    staleTime: 15e3
  });
}

// src/hooks/usePurchased.ts
import { useQuery as useQuery5 } from "@tanstack/react-query";
import { useAccount as useAccount2 } from "wagmi";
function usePurchased(listingId) {
  const { address: user } = useAccount2();
  const { client, chainId } = useTimeLockContent();
  return useQuery5({
    queryKey: ["timelock", "purchased", chainId, listingId?.toString(), user],
    enabled: !!listingId && !!user,
    queryFn: async () => {
      if (!listingId || !user) return false;
      return client.purchased(listingId, user);
    },
    staleTime: 15e3
  });
}

// src/hooks/useCreateWhistleBlowerListing.ts
import { useMutation as useMutation5, useQueryClient as useQueryClient5 } from "@tanstack/react-query";
import { TimelockHelper } from "@webdrei/timelock-content-sdk";
function useCreateWhistleblowerListing(opts) {
  const qc = useQueryClient5();
  const { client } = useTimeLockContent({ address: opts?.address });
  return useMutation5({
    mutationFn: async (args) => {
      const drandRound = TimelockHelper.getDrandRound(args.releaseTime);
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
    }
  });
}
export {
  useAllListingsParsed,
  useBuyListing,
  useClaimRefund,
  useCreateListing,
  useCreateWhistleblowerListing,
  useListing,
  useListingParsed,
  usePurchased,
  useRefunded,
  useRevealKey,
  useTimeLockContent
};
//# sourceMappingURL=index.js.map