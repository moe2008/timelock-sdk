import type { Address, Hash, Hex, PublicClient, WalletClient } from "viem";
import { getContract, parseEventLogs, toHex } from "viem";
import { ABI as timeLockContentAbi } from "@webdrei/timelock-content-contracts";
import type { BuyArgs, CreateListingArgs, ListingParsed, RevealKeyArgs, TxResult } from "./types.js";
import { parseListing } from "./helpers.js";

export function createTimeLockContentClient(cfg: {
    address: Address;
    publicClient: PublicClient;
    walletClient?: WalletClient;
}) {
    const readContract = getContract({
        address: cfg.address,
        abi: timeLockContentAbi,
        client: { public: cfg.publicClient },
    });

    const writeContract = cfg.walletClient
        ? getContract({
            address: cfg.address,
            abi: timeLockContentAbi,
            client: { wallet: cfg.walletClient },
        })
        : null;

    const requireWrite = () => {
        if (!writeContract) throw new Error("walletClient required for write calls");
        return writeContract;
    };

    // -------- Event parsing helpers --------
    function getListingCreatedFromReceipt(receipt: any): { listingId: bigint } | null {
        const logs = parseEventLogs({
            abi: timeLockContentAbi,
            eventName: "ListingCreated",
            logs: receipt.logs ?? [],
        });
        const first = logs?.[0];
        if (!first) return null;
        return { listingId: BigInt(first.args.listingId) };
    }

    return {
        // ---------- READ ----------
        listingCount: () => readContract.read.listingCount(),

        getListing: (listingId: bigint) => readContract.read.getListing([listingId]),

        async getListingParsed(listingId: bigint): Promise<ListingParsed> {
            const listing = await readContract.read.getListing([listingId]);
            return parseListing(listing); // 🔥 listing ist jetzt Struct, kein Tuple
        },

        purchased: (listingId: bigint, buyer: Address) =>
            readContract.read.purchased([listingId, buyer]),

        refunded: (listingId: bigint, buyer: Address) =>
            readContract.read.refunded([listingId, buyer]),

        // ---------- WRITE (txHash) ----------
        async createListing(args: CreateListingArgs): Promise<Hash> {
            const c = requireWrite();

            // 🔥 Timelock defaults für backward compatibility
            const isTimelockEnabled = args.isTimelockEnabled ?? false;
            const drandRound = args.drandRound ?? 0n;
            const timelockEncryptedKey = args.timelockEncryptedKey ?? "0x";

            return c.write.createListing(
                [
                    args.price,
                    args.releaseTime,
                    args.cipherUri,
                    args.cipherHash,
                    args.keyCommitment,
                    args.revealGraceSeconds,
                    isTimelockEnabled,
                    drandRound,
                    timelockEncryptedKey as Hex,
                ],
                {
                    value: args.deposit ?? 0n,
                    account: cfg.walletClient?.account ?? null,
                    chain: cfg.walletClient?.chain ?? null
                }
            );
        },

        async buy(args: BuyArgs): Promise<Hash> {
            const c = requireWrite();
            return c.write.buy(
                [args.listingId],
                {
                    value: args.price,
                    account: cfg.walletClient?.account ?? null,
                    chain: cfg.walletClient?.chain ?? null
                }
            );
        },

        async revealKey(args: RevealKeyArgs): Promise<Hash> {
            const c = requireWrite();
            const keyHex = toHex(args.key) as Hex;
            return c.write.revealKey(
                [args.listingId, keyHex, args.salt],
                {
                    account: cfg.walletClient?.account ?? null,
                    chain: cfg.walletClient?.chain ?? null
                }
            );
        },

        async claimRefund(listingId: bigint): Promise<Hash> {
            const c = requireWrite();
            return c.write.claimRefund(
                [listingId],
                {
                    account: cfg.walletClient?.account ?? null,
                    chain: cfg.walletClient?.chain ?? null
                }
            );
        },

        // ---------- WRITE + WAIT (receipt + parsed data) ----------
        async createListingAndWait(args: CreateListingArgs): Promise<TxResult<{ listingId: bigint }>> {
            const txHash = await this.createListing(args);
            const receipt = await cfg.publicClient.waitForTransactionReceipt({ hash: txHash });
            const ev = getListingCreatedFromReceipt(receipt);
            if (!ev) throw new Error("ListingCreated event not found in receipt");
            return { txHash, receipt, data: ev };
        },

        async buyAndWait(args: BuyArgs): Promise<TxResult> {
            const txHash = await this.buy(args);
            const receipt = await cfg.publicClient.waitForTransactionReceipt({ hash: txHash });
            return { txHash, receipt };
        },

        async revealKeyAndWait(args: RevealKeyArgs): Promise<TxResult> {
            const txHash = await this.revealKey(args);
            const receipt = await cfg.publicClient.waitForTransactionReceipt({ hash: txHash });
            return { txHash, receipt };
        },

        async claimRefundAndWait(listingId: bigint): Promise<TxResult> {
            const txHash = await this.claimRefund(listingId);
            const receipt = await cfg.publicClient.waitForTransactionReceipt({ hash: txHash });
            return { txHash, receipt };
        },
    };
}