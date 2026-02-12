"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../../components/landingpage/HomeSection";
import { formatEther } from "viem";
import { useListingParsed, useTimeLockContent, useClaimRefund, useBuyListing, usePurchased, useRefunded } from "@webdrei/timelock-content-react";
import { useAccount } from "wagmi";
import { toHex } from "viem";
import { TimelockHelper } from "@webdrei/timelock-content-sdk";
import { Toast } from "../../components/landingpage/ClosingSection";

type AssetStatus = "locked" | "unlockable" | "unlocked";

type LockedAsset = {
    id: string;
    listingId: string;
    fileName: string;
    fileSize: string;
    unlockTime: string; // ISO
    lockedAt: string; // ISO
    status: AssetStatus;
    seller?: string;
    buyer?: string;
    price?: bigint;
    releaseTime?: bigint;
    cipherUri?: string;
    revealed?: boolean;
    deposit?: bigint;
};

const getTimeRemainingFor = (unlockIso: string) => {
    const now = Date.now();
    const unlock = new Date(unlockIso).getTime();
    const diff = unlock - now;

    if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { expired: false, days, hours, minutes, seconds };
};

export default function LockDetailPage() {
    const [listingId, setListingId] = useState<bigint | null>(null);
    const [asset, setAsset] = useState<LockedAsset | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [tick, setTick] = useState(0);
    const [autoDecryptKey, setAutoDecryptKey] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);

    const { address: contractAddress, chainId } = useTimeLockContent();
    const { address: me, isConnected } = useAccount();

    // 🔥 FIX: bigint statt string
    const purchasedQ = usePurchased(listingId ?? undefined);
    const refundedQ = useRefunded(listingId ?? undefined);

    const buyMutation = useBuyListing();
    const refundMutation = useClaimRefund();

    const {
        data: listing,
        isLoading,
        error: fetchError,
    } = useListingParsed(listingId ?? undefined);


    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
    } | null>(null);
    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
    };

    const isPaid = (listing?.price ?? 0n) > 0n;
    const hasPurchased = purchasedQ.data === true;
    const hasRefunded = refundedQ.data === true;

    const nowSec = BigInt(Math.floor(Date.now() / 1000));
    const releaseTime = listing?.releaseTime ?? 0n;
    const revealDeadline = listing?.revealDeadline ?? 0n;

    const keyRevealed = listing?.keyRevealed === true;

    const canBuy = isConnected && isPaid && !hasPurchased;
    const canRefund =
        isConnected &&
        isPaid &&
        hasPurchased &&
        !keyRevealed &&
        nowSec > revealDeadline &&
        !hasRefunded;

    // Countdown ticker
    useEffect(() => {
        const i = setInterval(() => setTick((x) => x + 1), 1000);
        return () => clearInterval(i);
    }, []);

    // Extract listingId from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const idParam = params.get("listingId");

        if (!idParam) {
            setError("No listing ID found in URL.");
            return;
        }

        try {
            const id = BigInt(idParam);
            setListingId(id);
        } catch {
            setError("Invalid listing ID format.");
        }
    }, []);

    // Transform parsed listing -> LockedAsset
    useEffect(() => {
        if (!listing || !listingId) return;

        const now = Date.now();
        const releaseMs = Number(listing.releaseTime) * 1000;
        const unlockTime = new Date(releaseMs);

        const fileName = listing.cipherUri?.replace("demo://", "") || "Unknown File";

        const status: AssetStatus = listing.keyRevealed
            ? "unlocked"
            : now >= releaseMs
                ? "unlockable"
                : "locked";

        setAsset({
            id: `LISTING-${listingId.toString()}`,
            listingId: listingId.toString(),
            fileName,
            fileSize: "0 KB",
            unlockTime: unlockTime.toISOString(),
            lockedAt: new Date().toISOString(),
            status,
            seller: listing.seller,
            buyer: listing.seller,
            price: listing.price,
            releaseTime: listing.releaseTime,
            cipherUri: listing.cipherUri,
            revealed: listing.keyRevealed,
            deposit: listing.deposit,
        });
    }, [listing, listingId]);

    useEffect(() => {
        if (fetchError) {
            setError(`Failed to load listing: ${fetchError.message}`);
        }
    }, [fetchError]);

    const time = useMemo(() => {
        if (!asset) return null;
        return getTimeRemainingFor(asset.unlockTime);
    }, [asset, tick]);

    const statusLabel = asset?.revealed || autoDecryptKey ? "UNLOCKED" : time?.expired ? "UNLOCKABLE" : "LOCKED";

    const statusClass = asset?.revealed || autoDecryptKey
        ? "text-blue-400 border-blue-500/30 bg-blue-500/10"
        : time?.expired
            ? "text-green-400 border-green-500/30 bg-green-500/10"
            : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";

    const copyThisLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            setCopied(false);
        }
    };

    const goPlayground = () => {
        window.location.href = `/playground?listingId=${listingId}`;
    };

    const isWhistleblower = listing?.isTimelockEnabled === true;
    const canAutoDecrypt = isWhistleblower && time?.expired && !asset?.revealed && !autoDecryptKey;

    // 🔥 Auto-decrypt function
    const handleAutoDecrypt = async () => {
        if (!listing?.isTimelockEnabled || !listing?.drandRound || !listing?.timelockEncryptedKey) {
            return;
        }

        setIsDecrypting(true);
        try {
            if (!TimelockHelper.isRoundReached(listing.drandRound)) {
                showToast("Drand round not yet available. Please wait a moment and try again.", "error");
                return;
            }

            const decryptedKey = await TimelockHelper.decryptWithRound(
                listing.timelockEncryptedKey,
                listing.drandRound
            );

            const keyHex = toHex(decryptedKey);
            setAutoDecryptKey(keyHex);
            showToast("Key auto-decrypted successfully! No transaction needed!", "success")
        } catch (e: any) {
            console.error(e);
            showToast(`Auto-decrypt failed: ${e.message}`, "error")
        } finally {
            setIsDecrypting(false);
        }
    };

    // 🔥 Download function (demo - just shows the key)
    const handleDownload = () => {
        const keyToUse = autoDecryptKey || (keyRevealed ? listing?.revealedKey : null);

        if (!keyToUse) {
            showToast("No decryption key available yet.", "error")
            return;
        }
        showToast(`📥 In production, this would download and decrypt the file using key: ${keyToUse}\n\nFor this demo, use the Playground to download files stored locally.`, "info")
    };

    // Check if content is downloadable
    const canDownload = (keyRevealed || autoDecryptKey) && asset;

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="pt-32 pb-20 px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full px-4 py-2 mb-6">
                            <span className="text-2xl">🔗</span>
                            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                                Lock Details
                            </span>
                        </div>

                        <h1 className="text-5xl font-bold text-white mb-3">Time-Locked Content</h1>
                        <p className="text-gray-400 text-lg">
                            On-chain time-lock. Automatically unlocks when release time is reached.
                        </p>
                    </motion.div>

                    {isLoading && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-3"
                            />
                            <div className="text-gray-400">Loading listing from blockchain...</div>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-200">
                            <div className="font-bold mb-2">Could not load lock</div>
                            <div className="text-sm opacity-90">{error}</div>
                            <div className="mt-4 text-sm text-gray-300">
                                Tip: Open this page via a Share link like{" "}
                                <span className="font-mono">/lock?listingId=1</span>
                            </div>
                        </div>
                    )}

                    {asset && !isLoading && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full border whitespace-nowrap ${statusClass}`}>
                                                {statusLabel}
                                            </span>
                                            {isWhistleblower && (
                                                <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 text-xs font-semibold">
                                                    🔓 AUTO-RELEASE
                                                </span>
                                            )}
                                            <span className="text-cyan-400/70 text-xs font-mono truncate">{asset.id}</span>
                                        </div>

                                        <h2 className="text-3xl font-bold text-white mb-3">{asset.fileName}</h2>

                                        <div className="space-y-2 text-sm">
                                            <div className="text-gray-400">
                                                Price:{" "}
                                                <span className="text-white font-semibold">
                                                    {asset.price && asset.price > 0n ? `${formatEther(asset.price)} ETH` : "Free"}
                                                </span>
                                            </div>

                                            <div className="text-gray-400">
                                                Seller:{" "}
                                                <span className="text-white font-mono text-xs">
                                                    {asset.seller ? `${asset.seller.slice(0, 6)}...${asset.seller.slice(-4)}` : "Unknown"}
                                                </span>
                                            </div>
                                            {isPaid && (
                                                <div className="text-gray-400">
                                                    Purchase:{" "}
                                                    <span className={hasPurchased ? "text-green-400 font-semibold" : "text-gray-300"}>
                                                        {hasPurchased ? "✅ You purchased" : "Not purchased"}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="text-gray-400">
                                                Unlock time:{" "}
                                                <span className="text-white">{new Date(asset.unlockTime).toLocaleString()}</span>
                                            </div>

                                            {asset.deposit && asset.deposit > 0n && (
                                                <div className="text-gray-400">
                                                    Deposit: <span className="text-white">{formatEther(asset.deposit)} ETH</span>
                                                </div>
                                            )}
                                        </div>

                                        {isWhistleblower && (
                                            <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                                                <div className="text-purple-300 text-sm font-semibold mb-1">
                                                    ⚡ Timelock Encryption Enabled
                                                </div>
                                                <div className="text-purple-400/70 text-xs">
                                                    Key auto-decrypts at unlock time via drand (round {listing?.drandRound.toString()})
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-3 shrink-0">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={copyThisLink}
                                            className="bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl font-bold hover:bg-white/10 transition"
                                        >
                                            {copied ? "✅ Link Copied" : "🔗 Copy Link"}
                                        </motion.button>
                                        {isPaid && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                disabled={!canBuy || buyMutation.isPending}
                                                onClick={() => {
                                                    if (!listingId || !listing?.price) return;
                                                    buyMutation.mutate({ listingId, price: listing.price });
                                                }}
                                                className={`px-5 py-3 rounded-xl font-bold transition ${canBuy
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/40 hover:shadow-green-500/60"
                                                    : "bg-white/5 border border-white/10 text-gray-400 opacity-60 cursor-not-allowed"
                                                    }`}
                                            >
                                                {buyMutation.isPending ? "Buying..." : `Buy (${formatEther(listing!.price)} ETH)`}
                                            </motion.button>
                                        )}

                                        {/* 🔥 Download Button */}
                                        {canDownload && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleDownload}
                                                className={`px-5 py-3 rounded-xl font-bold shadow-lg transition ${autoDecryptKey
                                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/40 hover:shadow-purple-500/60"
                                                    : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/40 hover:shadow-cyan-500/60"
                                                    }`}
                                            >
                                                📥 Download Content
                                            </motion.button>
                                        )}

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={goPlayground}
                                            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 transition"
                                        >
                                            Open in Playground
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="mt-8 bg-black/50 border border-cyan-500/30 rounded-2xl p-8">
                                    <h3 className="text-white font-bold mb-6 text-center text-xl">
                                        {asset.revealed || autoDecryptKey ? "Content Unlocked!" : "Time Until Unlock"}
                                    </h3>

                                    {time && !time.expired && !asset.revealed && !autoDecryptKey && (
                                        <div className="grid grid-cols-4 gap-4">
                                            {[
                                                { label: "Days", value: time.days },
                                                { label: "Hours", value: time.hours },
                                                { label: "Minutes", value: time.minutes },
                                                { label: "Seconds", value: time.seconds },
                                            ].map((item) => (
                                                <div key={item.label} className="text-center">
                                                    <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-4 mb-2">
                                                        <div className="text-4xl font-bold text-cyan-400">
                                                            {String(item.value).padStart(2, "0")}
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-500 text-xs uppercase tracking-wider">{item.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {autoDecryptKey && (
                                        <div className="text-center">
                                            <div className="text-8xl mb-4">🎉</div>
                                            <div className="text-green-400 text-xl font-semibold mb-4">
                                                Key Auto-Decrypted!
                                            </div>
                                            <div className="text-gray-400 text-sm mb-6">
                                                The decryption key was automatically revealed via drand timelock encryption.
                                                <br />
                                                <strong className="text-purple-300">No blockchain transaction was needed!</strong>
                                            </div>
                                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                                                <div className="text-purple-300 text-sm font-semibold mb-2">Decrypted Key:</div>
                                                <div className="text-white font-mono text-xs break-all">
                                                    {autoDecryptKey}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {asset.revealed && !autoDecryptKey && (
                                        <div className="text-center">
                                            <div className="text-8xl mb-4">🎉</div>
                                            <div className="text-green-400 text-xl font-semibold mb-4">
                                                Key has been revealed on-chain!
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                The decryption key is now public. Content can be decrypted.
                                            </div>
                                        </div>
                                    )}

                                    {time?.expired && !asset.revealed && !autoDecryptKey && (
                                        <div className="text-center">
                                            <div className="text-green-400 text-xl font-semibold mb-4">⏰ Unlock time reached!</div>
                                            {isWhistleblower ? (
                                                <>
                                                    <div className="text-gray-400 text-sm mb-6">
                                                        This is a timelock-encrypted listing. Click below to auto-decrypt the key.
                                                        <br />
                                                        <strong className="text-purple-300">No transaction or gas fees required!</strong>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={handleAutoDecrypt}
                                                        disabled={isDecrypting}
                                                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition"
                                                    >
                                                        {isDecrypting ? (
                                                            <>
                                                                <motion.div
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full inline-block mr-2"
                                                                />
                                                                Decrypting...
                                                            </>
                                                        ) : (
                                                            <>🔓 Auto-Decrypt Key (No TX!)</>
                                                        )}
                                                    </motion.button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-gray-400 text-sm mb-6">
                                                        Waiting for seller to reveal the decryption key on-chain...
                                                    </div>
                                                    {asset.seller && (
                                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm">
                                                            <div className="text-yellow-400 font-semibold mb-2">⚠️ Action Required (Seller)</div>
                                                            <div className="text-gray-300">
                                                                The seller must call <span className="font-mono">revealKey()</span> to publish the decryption key.
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {canRefund && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            disabled={refundMutation.isPending}
                                            onClick={() => {
                                                if (!listingId) return;
                                                refundMutation.mutate(listingId);
                                            }}
                                            className="mt-5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30"
                                        >
                                            {refundMutation.isPending ? "Claiming refund..." : "Claim Refund"}
                                        </motion.button>
                                    )}
                                </div>

                                {/* On-chain Details */}
                                <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                                        On-Chain Details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-500 mb-1">Listing ID</div>
                                            <div className="text-cyan-400 font-mono">{asset.listingId}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Status</div>
                                            <div className="text-white">{statusLabel}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Cipher URI</div>
                                            <div className="text-white font-mono text-xs truncate">{asset.cipherUri || "N/A"}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Key Revealed</div>
                                            <div className="text-white">{asset.revealed || autoDecryptKey ? "✅ Yes" : "❌ No"}</div>
                                        </div>
                                        {isWhistleblower && (
                                            <>
                                                <div>
                                                    <div className="text-gray-500 mb-1">Timelock Mode</div>
                                                    <div className="text-purple-400">✅ Enabled</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500 mb-1">Drand Round</div>
                                                    <div className="text-white font-mono">{listing?.drandRound.toString()}</div>
                                                </div>
                                            </>
                                        )}

                                        <div className="md:col-span-2">
                                            <div className="text-gray-500 mb-1">Contract</div>
                                            <div className="text-white font-mono text-xs truncate">
                                                {contractAddress} (chainId: {chainId})
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">ℹ️</span>
                                    <div>
                                        <h3 className="text-white font-semibold mb-2">How It Works</h3>
                                        <p className="text-gray-400 text-sm">
                                            This content is time-locked using blockchain smart contracts. In production the encrypted
                                            data lives on IPFS/Arweave. After the release time, the key is revealed (either manually by the seller or automatically via drand timelock encryption).
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}