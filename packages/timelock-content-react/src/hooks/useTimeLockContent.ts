import { useMemo } from "react";
import type { Address } from "viem";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";
import { createTimeLockContentClient, getTimelockAddress } from "@webdrei/timelock-content-sdk";

export function useTimeLockContent(opts?: { address?: Address }) {
    const chainId = useChainId();
    const publicClient = usePublicClient();
    if (!publicClient) throw new Error("No publicClient (wagmi config missing?)");
    const { data: walletClient } = useWalletClient();

    const address = opts?.address ?? getTimelockAddress(chainId);

    const client = useMemo(() => {
        return createTimeLockContentClient({
            address,
            publicClient,
            walletClient: walletClient ?? undefined,
        });
    }, [address, publicClient, walletClient]);

    return { client, address, chainId, publicClient, walletClient };
}
