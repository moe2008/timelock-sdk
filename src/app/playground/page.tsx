"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "../../components/landingpage/HomeSection";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { randomKey32, randomSalt32, commitKey, TimelockHelper } from "@webdrei/timelock-content-sdk";
import { useCreateListing, useAllListingsParsed, useTimeLockContent, useRevealKey } from "@webdrei/timelock-content-react";
import { toHex } from "viem";
import { parseEther } from "viem";
import { idbPutFile, idbGetFile } from "../../components/lib/idb";
import { Toast } from "../../components/landingpage/ClosingSection";
import { ABI } from "@webdrei/timelock-content-contracts";


const PlaygroundPage: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [file, setFile] = useState<File | null>(null);
    const [unlockDate, setUnlockDate] = useState<string>("");
    const [unlockTime, setUnlockTime] = useState<string>("");

    const { isConnected } = useAccount();
    const { address, chainId } = useTimeLockContent();
    const revealKeyMutation = useRevealKey();
    const createListingMutation = useCreateListing();

    useEffect(() => {
        console.log("🔍 All functions in ABI:");
        const functions = ABI.filter((x: any) => x.type === "function");
        console.log("Total functions:", functions.length);
        console.log("Function names:", functions.map((f: any) => f.name));

        console.log("\n📋 Full function details:");
        functions.forEach((f: any) => {
            console.log(`${f.name}:`, f.inputs?.map((i: any) => `${i.name}: ${i.type}`));
        });
    }, []);


    const { data: onChainListings, isLoading: isLoadingListings } = useAllListingsParsed();

    const [isLocking, setIsLocking] = useState<boolean>(false);

    const [isFree, setIsFree] = useState(true);
    const [priceEth, setPriceEth] = useState("0.01"); // string input

    const priceWei = isFree ? 0n : parseEther(priceEth || "0");

    const [isWhistleblowerMode, setIsWhistleblowerMode] = useState(false);

    type AssetStatus = "locked" | "unlockable" | "unlocked";

    type LockedAsset = {
        id: string;
        listingId?: string;
        fileName: string;
        fileSize: string;
        unlockTime: string;
        lockedAt: string;
        status: AssetStatus;
        seller?: string;
        price?: bigint;
        releaseTime?: bigint;
        cipherUri?: string;
        keyRevealed?: boolean;
    };

    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Transform on-chain listings to LockedAsset format
    const assets: LockedAsset[] = useMemo(() => {
        if (!onChainListings) return [];

        return onChainListings.map((listing: any) => {
            const now = Date.now();
            const releaseMs = Number(listing.releaseTime) * 1000;
            const unlockTime = new Date(releaseMs);

            // Extract filename from cipherUri (demo://<filename>)
            const fileName = listing.cipherUri?.replace("demo://", "") || "Unknown File";

            const status: AssetStatus = listing.keyRevealed
                ? "unlocked"
                : now >= releaseMs
                    ? "unlockable"
                    : "locked";

            const listingIdStr =
                listing.listingId !== undefined ? listing.listingId.toString() : "0";

            return {
                id: `LISTING-${listingIdStr}`,
                listingId: listingIdStr,
                fileName,
                fileSize: "0 KB", // Not stored on-chain in demo
                unlockTime: unlockTime.toISOString(),
                lockedAt: new Date().toISOString(), // Not stored on-chain
                status,
                seller: listing.seller,
                price: listing.price,
                releaseTime: listing.releaseTime,
                cipherUri: listing.cipherUri,
                keyRevealed: listing.keyRevealed,
            };
        });
    }, [onChainListings]);

    const selectedAsset = assets.find((a) => a.id === selectedAssetId) ?? null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
    };


    function storageKeyFile(chainId: number, contract: string, listingId: string) {
        return `timelock:file:${chainId}:${contract.toLowerCase()}:${listingId}`;
    }
    function storageKeySecret(chainId: number, contract: string, listingId: string) {
        return `timelock:secret:${chainId}:${contract.toLowerCase()}:${listingId}`;
    }

    function saveJSON(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    function loadJSON<T>(key: string): T | null {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try { return JSON.parse(raw) as T; } catch { return null; }
    }

    const ZERO32 = ("0x" + "0".repeat(64)) as `0x${string}`;

    const toUnixSeconds = (date: string, time: string) => {
        const ms = new Date(`${date}T${time}`).getTime();
        return BigInt(Math.floor(ms / 1000));
    };

    function downloadBlob(blob: Blob, filename: string) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    const handleLock = async () => {
        if (!file || !unlockDate || !unlockTime) return;

        if (!isConnected) {
            showToast("Connect wallet first", "error");
            return;
        }

        setIsLocking(true);

        try {
            const releaseTime = toUnixSeconds(unlockDate, unlockTime);

            // 🔥 Whistleblower Mode: Use Timelock Encryption
            if (isWhistleblowerMode) {
                // Generate encryption key
                const keyBytes = randomKey32();

                // Calculate drand round for release time
                const drandRound = TimelockHelper.getDrandRound(releaseTime);

                // Encrypt key with drand (auto-release)
                const timelockEncryptedKey = await TimelockHelper.encryptWithRound(
                    keyBytes,
                    drandRound
                );

                // Create whistleblower listing
                const result = await createListingMutation.mutateAsync({
                    price: 0n, // Whistleblower listings are free
                    releaseTime,
                    cipherUri: `demo://${file.name}`,
                    cipherHash: ZERO32,
                    keyCommitment: ZERO32, // Not needed for timelock
                    revealGraceSeconds: 0n, // Not needed for timelock
                    deposit: 0n,

                    // 🔥 Timelock enabled
                    isTimelockEnabled: true,
                    drandRound,
                    timelockEncryptedKey,
                });

                const listingId = result.data?.listingId?.toString() ?? result.txHash;

                // Store local key for demo purposes (in production: not needed, key auto-decrypts)
                saveJSON(storageKeySecret(chainId, address, listingId), {
                    keyHex: toHex(keyBytes),
                    salt: ZERO32,
                    createdAt: Date.now(),
                    isWhistleblower: true,
                    drandRound: drandRound.toString(),
                });

                // Store file locally
                await idbPutFile({
                    key: storageKeyFile(chainId, address, listingId),
                    name: file.name,
                    mime: file.type || "application/octet-stream",
                    size: file.size,
                    data: await file.arrayBuffer(),
                    createdAt: Date.now(),
                });

                showToast("Whistleblower listing created! Key will auto-release.", "success");
                setSelectedAssetId(`LISTING-${listingId}`);
                setStep(2);

            } else {
                // 🔄 Normal Mode (existing code)
                const keyBytes = randomKey32();
                const salt = randomSalt32();
                const keyCommitment = commitKey(keyBytes, salt);

                const result = await createListingMutation.mutateAsync({
                    price: priceWei,
                    releaseTime,
                    cipherUri: `demo://${file.name}`,
                    cipherHash: ZERO32,
                    keyCommitment,
                    revealGraceSeconds: 7n * 24n * 60n * 60n,
                    deposit: 0n,
                });

                const listingId = result.data?.listingId?.toString() ?? result.txHash;

                saveJSON(storageKeySecret(chainId, address, listingId), {
                    keyHex: toHex(keyBytes),
                    salt,
                    createdAt: Date.now(),
                });

                await idbPutFile({
                    key: storageKeyFile(chainId, address, listingId),
                    name: file.name,
                    mime: file.type || "application/octet-stream",
                    size: file.size,
                    data: await file.arrayBuffer(),
                    createdAt: Date.now(),
                });

                setSelectedAssetId(`LISTING-${listingId}`);
                setStep(2);
            }

        } catch (e: any) {
            console.error(e);
            showToast(e?.shortMessage ?? e?.message ?? "Lock failed", "error");
        } finally {
            setIsLocking(false);
        }
    };



    const handleUnlock = async () => {
        if (!selectedAsset?.listingId) return;

        const listingId = selectedAsset.listingId;
        const nowSec = BigInt(Math.floor(Date.now() / 1000));

        if (selectedAsset.releaseTime && nowSec < selectedAsset.releaseTime) {
            showToast("Too early. Release time not reached yet.", "info");
            return;
        }

        // 🔥 Check if this is a whistleblower (timelock) listing
        const listing = onChainListings?.find(l => l.listingId?.toString() === listingId);
        const isWhistleblower = listing?.isTimelockEnabled;

        if (isWhistleblower) {
            // 🔥 AUTO-DECRYPT PATH - No transaction needed!
            try {
                showToast("Auto-decrypting with drand...", "info");

                // Check if round is reached
                if (!TimelockHelper.isRoundReached(listing.drandRound)) {
                    showToast("Drand round not yet available. Wait a moment...", "info");
                    return;
                }

                // Decrypt the key automatically from on-chain data
                const decryptedKey = await TimelockHelper.decryptWithRound(
                    listing.timelockEncryptedKey,
                    listing.drandRound
                );

                // 🔥 Store decrypted key locally (for demo download)
                saveJSON(storageKeySecret(chainId, address, listingId), {
                    keyHex: toHex(decryptedKey),
                    salt: ZERO32,
                    createdAt: Date.now(),
                    isWhistleblower: true,
                    autoDecrypted: true,
                });

                showToast("🎉 Key auto-decrypted! No transaction needed!", "success");
                setStep(3);

            } catch (e: any) {
                console.error(e);
                showToast(e?.message ?? "Auto-decrypt failed", "error");
            }

        } else {
            // 🔄 NORMAL PATH - Manual reveal with transaction
            const secret = loadJSON<{ keyHex: `0x${string}`; salt: `0x${string}` }>(
                storageKeySecret(chainId, address, listingId)
            );
            if (!secret) {
                showToast("No local key found for this listing (this browser didn't create it).", "error");
                return;
            }

            const hex = secret.keyHex.slice(2);
            const keyBytes = Uint8Array.from(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));

            try {
                await revealKeyMutation.mutateAsync({
                    listingId: BigInt(listingId),
                    key: keyBytes,
                    salt: secret.salt,
                });

                setStep(3);
            } catch (e: any) {
                console.error(e);
                showToast(e?.shortMessage ?? e?.message ?? "Reveal failed", "error");
            }
        }
    };

    const reset = () => {
        setStep(1);
        setFile(null);
        setUnlockDate("");
        setUnlockTime("");
        setSelectedAssetId(null);
    };

    const shareAsset = async (asset: LockedAsset) => {
        const url = `${window.location.origin}/lock?listingId=${asset.listingId}`;

        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(asset.id);
            setTimeout(() => setCopiedId(null), 1200);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = url;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);

            setCopiedId(asset.id);
            setTimeout(() => setCopiedId(null), 1200);
        }
    };

    // Handle URL import of listing
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const listingId = params.get("listingId");
        if (!listingId) return;

        if (assets.length > 0) {
            const asset = assets.find((a) => a.listingId === listingId);
            if (asset) {
                setSelectedAssetId(asset.id);
                setStep(asset.keyRevealed ? 3 : 2);

                params.delete("listingId");
                const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""
                    }`;
                window.history.replaceState({}, "", newUrl);
            }
        }
    }, [assets]);

    const getTimeRemainingFor = (unlockIso: string) => {
        const now = Date.now();
        const unlock = new Date(unlockIso).getTime();
        const diff = unlock - now;

        if (diff <= 0) {
            return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { expired: false, days, hours, minutes, seconds };
    };

    const timeRemaining = selectedAsset
        ? getTimeRemainingFor(selectedAsset.unlockTime)
        : null;

    const canUnlock = selectedAsset?.status === "unlockable" && !selectedAsset?.keyRevealed;
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
    } | null>(null);
    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
    };
    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>
            <div className="pt-32 pb-20 px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full px-4 py-2 mb-6">
                            <span
                                className="w-4 h-4 bg-white inline-block"
                                style={{
                                    WebkitMask: "url(/icons/SVG/brain.svg) no-repeat center / contain",
                                    mask: "url(/icons/SVG/brain.svg) no-repeat center / contain",
                                }}
                            />
                            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                                Playground
                            </span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
                            Test Time-Lock
                            <br />
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Mechanism
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Upload a file, set a time-lock, and see how it works in real-time
                        </p>
                    </motion.div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        {[
                            { num: 1, label: "Upload & Lock", icon: "/icons/SVG/document.svg" },
                            { num: 2, label: "Locked", icon: "/icons/SVG/padlock.svg" },
                            { num: 3, label: "Unlocked", icon: "/icons/SVG/send.svg" },
                        ].map((s, idx) => (
                            <React.Fragment key={s.num}>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: step >= s.num ? 1 : 0.8,
                                        opacity: step >= s.num ? 1 : 0.5,
                                    }}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all ${step >= s.num
                                        ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                                        : "bg-white/5 border-white/10 text-gray-500"
                                        }`}
                                >
                                    <MaskIcon src={s.icon} size={22} className="bg-white" />
                                    <div className="text-sm font-semibold">{s.label}</div>
                                </motion.div>
                                {idx < 2 && (
                                    <div
                                        className={`h-0.5 w-12 transition-all ${step > s.num ? "bg-cyan-500" : "bg-white/10"
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Main Content */}
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8 lg:p-12"
                    >
                        {/* Step 1: Upload & Lock */}
                        {step === 1 && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-white">
                                    Upload Your Content
                                </h2>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-gray-400 mb-3 text-sm font-semibold">
                                        Select File to Lock
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-cyan-500/30 rounded-xl hover:border-cyan-500/50 transition cursor-pointer group"
                                        >
                                            {file ? (
                                                <div className="text-center">
                                                    <div className="text-5xl mb-3">📄</div>
                                                    <div className="text-white font-semibold">
                                                        {file.name}
                                                    </div>
                                                    <div className="text-gray-500 text-sm">
                                                        {(file.size / 1024).toFixed(2)} KB
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="text-5xl mb-3 group-hover:scale-110 transition">
                                                        <span
                                                            className="w-16 h-16 bg-white inline-block"
                                                            style={{
                                                                WebkitMask:
                                                                    "url(/icons/SVG/document.svg) no-repeat center / contain",
                                                                mask: "url(/icons/SVG/document.svg) no-repeat center / contain",
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="text-cyan-400 font-semibold">
                                                        Click to upload
                                                    </div>
                                                    <div className="text-gray-500 text-sm">
                                                        or drag and drop
                                                    </div>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 mb-3 text-sm font-semibold">
                                            Unlock Date
                                        </label>
                                        <input
                                            type="date"
                                            value={unlockDate}
                                            onChange={(e) => setUnlockDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-3 text-sm font-semibold">
                                            Unlock Time
                                        </label>
                                        <input
                                            type="time"
                                            value={unlockTime}
                                            onChange={(e) => setUnlockTime(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition"
                                        />
                                    </div>
                                </div>
                                {!isWhistleblowerMode && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-white font-semibold">Pricing</div>
                                            <label className="flex items-center gap-2 text-gray-300 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={isFree}
                                                    onChange={(e) => setIsFree(e.target.checked)}
                                                    className="w-4 h-4"
                                                />
                                                Free
                                            </label>
                                        </div>

                                        {!isFree && (
                                            <div>
                                                <label className="block text-gray-400 mb-2 text-sm font-semibold">
                                                    Price (ETH)
                                                </label>
                                                <input
                                                    value={priceEth}
                                                    onChange={(e) => setPriceEth(e.target.value)}
                                                    placeholder="0.01"
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 🔥 Advanced Options - Updated */}
                                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                        <MaskIcon src="/icons/SVG/maintenance.svg" size={16} className="bg-white" />
                                        Advanced Options
                                    </h3>
                                    <div className="space-y-4">
                                        {/* 🔥 Whistleblower Mode */}
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={isWhistleblowerMode}
                                                onChange={(e) => {
                                                    setIsWhistleblowerMode(e.target.checked);
                                                    if (e.target.checked) {
                                                        setIsFree(true); // Force free for whistleblower
                                                    }
                                                }}
                                                className="w-5 h-5 rounded bg-white/5 border-white/10 mt-0.5"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-300 group-hover:text-white transition">
                                                        Auto-Release (Whistleblower Mode)
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 text-xs font-semibold">
                                                        BETA
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                                                    Uses timelock encryption (drand). Key automatically becomes decryptable at release time
                                                    — no manual reveal needed. Perfect for whistleblowers or dead man's switch scenarios.
                                                </p>
                                                {isWhistleblowerMode && (
                                                    <div className="mt-2 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-sm">ℹ️</span>
                                                            <div className="text-xs text-purple-300 leading-relaxed">
                                                                <strong>How it works:</strong> Your key is encrypted with a future drand beacon round.
                                                                When that round is published (at your unlock time), anyone can decrypt the key.
                                                                No seller action required!
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Lock Button - Updated Text */}
                                <motion.button
                                    onClick={handleLock}
                                    disabled={!file || !unlockDate || !unlockTime || isLocking}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition ${file && unlockDate && unlockTime && !isLocking
                                        ? isWhistleblowerMode
                                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70"
                                            : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
                                        : "bg-white/5 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {isLocking ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                            {isWhistleblowerMode ? "Creating Auto-Release..." : "Locking Content..."}
                                        </>
                                    ) : (
                                        <>
                                            {isWhistleblowerMode ? (
                                                <>
                                                    <span>🔓</span>
                                                    Create Auto-Release Lock
                                                </>
                                            ) : (
                                                <>
                                                    <MaskIcon src="/icons/SVG/padlock.svg" size={16} className="bg-white" />
                                                    Lock Content
                                                </>
                                            )}
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        )}

                        {/* Step 2: Locked */}
                        {step === 2 && selectedAsset && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", duration: 0.6 }}
                                        className="text-8xl mb-6"
                                    >
                                        🔒
                                    </motion.div>
                                    <h2 className="text-3xl font-bold text-white mb-3">
                                        Content Locked!
                                    </h2>
                                    <p className="text-gray-400">
                                        Your content is now secured on-chain
                                    </p>
                                </div>

                                {/* Lock Details */}
                                <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="text-gray-400 text-sm mb-2">Lock ID</div>
                                            <div className="text-cyan-400 font-mono font-bold text-lg">
                                                {selectedAsset.id}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-sm mb-2">File Name</div>
                                            <div className="text-white font-semibold">
                                                {selectedAsset.fileName}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-sm mb-2">Price</div>
                                            <div className="text-white font-semibold">
                                                {selectedAsset.price && selectedAsset.price > 0n
                                                    ? `${formatEther(selectedAsset.price)} ETH`
                                                    : "Free"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-sm mb-2">Status</div>
                                            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full px-3 py-1">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                                                <span className="text-yellow-400 text-sm font-semibold">
                                                    Locked
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Countdown */}
                                <div className="bg-black/50 border border-cyan-500/30 rounded-2xl p-8">
                                    <h3 className="text-white font-bold mb-6 text-center text-xl">
                                        Time Until Unlock
                                    </h3>
                                    {timeRemaining && !timeRemaining.expired && (
                                        <div className="grid grid-cols-4 gap-4">
                                            {[
                                                { label: "Days", value: timeRemaining.days },
                                                { label: "Hours", value: timeRemaining.hours },
                                                { label: "Minutes", value: timeRemaining.minutes },
                                                { label: "Seconds", value: timeRemaining.seconds },
                                            ].map((item, idx) => (
                                                <div key={idx} className="text-center">
                                                    <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-4 mb-2">
                                                        <div className="text-4xl font-bold text-cyan-400">
                                                            {String(item.value).padStart(2, "0")}
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-500 text-xs uppercase tracking-wider">
                                                        {item.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {timeRemaining?.expired && (
                                        <div className="text-center text-green-400 text-xl font-semibold">
                                            ✅ Ready to unlock!
                                        </div>
                                    )}
                                </div>

                                {/* Unlock Button */}
                                <div className="flex gap-4">
                                    {(() => {
                                        // 🔥 Get listing in this scope
                                        const listing = onChainListings?.find(l => l.listingId?.toString() === selectedAsset.listingId);

                                        return (
                                            <motion.button
                                                onClick={handleUnlock}
                                                disabled={!canUnlock || revealKeyMutation.isPending}
                                                className={`flex-1 bg-gradient-to-r ${listing?.isTimelockEnabled
                                                        ? "from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70"
                                                        : "from-green-500 to-emerald-500 shadow-lg shadow-green-500/50 hover:shadow-green-500/70"
                                                    } text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition ${canUnlock ? "" : "opacity-50 cursor-not-allowed"
                                                    }`}
                                            >
                                                {revealKeyMutation.isPending ? (
                                                    "Revealing..."
                                                ) : listing?.isTimelockEnabled ? (
                                                    <>
                                                        <span>🔓</span>
                                                        Auto-Decrypt (No TX!)
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>🔓</span>
                                                        Reveal Key
                                                    </>
                                                )}
                                            </motion.button>
                                        );
                                    })()}

                                    <motion.button
                                        onClick={reset}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-8 bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition"
                                    >
                                        Reset
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Unlocked */}
                        {step === 3 && selectedAsset && (
                            <div className="space-y-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.6 }}
                                >
                                    <div className="text-8xl mb-6">🎉</div>
                                    <h2 className="text-4xl font-bold text-white mb-3">
                                        Content Unlocked!
                                    </h2>
                                    <p className="text-gray-400 text-lg">
                                        {(() => {
                                            const listing = onChainListings?.find(l => l.listingId?.toString() === selectedAsset.listingId);
                                            return listing?.isTimelockEnabled
                                                ? "Key was automatically decrypted via drand timelock encryption"
                                                : "Your content is now accessible";
                                        })()}
                                    </p>
                                </motion.div>

                                {/* Success Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className={`bg-gradient-to-br ${(() => {
                                        const listing = onChainListings?.find(l => l.listingId?.toString() === selectedAsset.listingId);
                                        return listing?.isTimelockEnabled
                                            ? "from-purple-900/30 to-pink-900/30 border-purple-500/30"
                                            : "from-green-900/30 to-emerald-900/30 border-green-500/30";
                                    })()
                                        } border rounded-2xl p-8`}
                                >
                                    <div className="flex items-center justify-center gap-3 mb-6">
                                        <div className={`w-3 h-3 rounded-full animate-pulse ${(() => {
                                            const listing = onChainListings?.find(l => l.listingId?.toString() === selectedAsset.listingId);
                                            return listing?.isTimelockEnabled ? "bg-purple-500" : "bg-green-500";
                                        })()
                                            }`} />
                                        <span className={`font-bold ${(() => {
                                            const listing = onChainListings?.find(l => l.listingId?.toString() === selectedAsset.listingId);
                                            return listing?.isTimelockEnabled ? "text-purple-400" : "text-green-400";
                                        })()
                                            }`}>
                                            {(() => {
                                                const listing = onChainListings?.find(l => l.listingId?.toString() === selectedAsset.listingId);
                                                return listing?.isTimelockEnabled ? "AUTO-DECRYPTED" : "UNLOCKED";
                                            })()}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-gray-400">
                                            File:{" "}
                                            <span className="text-white font-semibold">
                                                {selectedAsset.fileName}
                                            </span>
                                        </div>
                                        <div className="text-gray-400">
                                            Lock ID:{" "}
                                            <span className="text-cyan-400 font-mono">
                                                {selectedAsset.id}
                                            </span>
                                        </div>
                                        {(() => {
                                            const listing = onChainListings?.find(l => l.listingId?.toString() === selectedAsset.listingId);
                                            return listing?.isTimelockEnabled && (
                                                <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                                                    <div className="text-purple-300 text-sm font-semibold mb-1">
                                                        ⚡ No Transaction Required
                                                    </div>
                                                    <div className="text-purple-400/70 text-xs">
                                                        This key was automatically decrypted using drand timelock encryption.
                                                        No blockchain transaction or gas fees were needed!
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </motion.div>

                                {/* Download Button */}
                                <div className="flex flex-col gap-4">
                                    <motion.button
                                        onClick={async () => {
                                            if (!selectedAsset?.listingId) return;
                                            const listingId = selectedAsset.listingId;

                                            // 🔥 Check if we have the key (manual or auto-decrypted)
                                            const secret = loadJSON<{ keyHex: string; autoDecrypted?: boolean }>(
                                                storageKeySecret(chainId, address, listingId)
                                            );

                                            if (!secret) {
                                                showToast("No decryption key found. Please unlock first.", "error");
                                                return;
                                            }

                                            // 🔥 Get encrypted file from IndexedDB
                                            const rec = await idbGetFile(storageKeyFile(chainId, address, listingId));
                                            if (!rec) {
                                                showToast("No local file stored for this listing.", "error");
                                                return;
                                            }

                                            // 🔥 In production: decrypt file with secret.keyHex here
                                            // For demo: just download as-is (simulate decryption)
                                            showToast(
                                                secret.autoDecrypted
                                                    ? "🔓 File decrypted with auto-revealed key!"
                                                    : "🔓 File decrypted with revealed key!",
                                                "success"
                                            );

                                            const blob = new Blob([rec.data], { type: rec.mime });
                                            downloadBlob(blob, rec.name);
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full bg-gradient-to-r ${(() => {
                                            const listing = onChainListings?.find(l => l.listingId?.toString() === selectedAsset.listingId);
                                            return listing?.isTimelockEnabled
                                                ? "from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"
                                                : "from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50";
                                        })()
                                            } text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3`}
                                    >
                                        <span>📥</span>
                                        Download Content
                                    </motion.button>
                                    <motion.button
                                        onClick={reset}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition"
                                    >
                                        Try Another Lock
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* My Locked Assets */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="mt-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-6 lg:p-8"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-white font-bold text-xl">My Locked Assets</h3>
                            <div className="text-gray-500 text-sm">
                                {isLoadingListings ? "Loading..." : `${assets.length} total`}
                            </div>
                        </div>

                        {isLoadingListings ? (
                            <div className="text-gray-500 text-sm bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-8 h-8 border-2 border-gray-500/30 border-t-gray-500 rounded-full mx-auto mb-3"
                                />
                                Loading listings from blockchain...
                            </div>
                        ) : assets.length === 0 ? (
                            <div className="text-gray-500 text-sm bg-white/5 border border-white/10 rounded-xl p-4">
                                No assets yet. Create your first lock above.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {assets.map((a) => {
                                    const t = getTimeRemainingFor(a.unlockTime);
                                    const isSelected = a.id === selectedAssetId;

                                    const statusLabel = a.keyRevealed
                                        ? "UNLOCKED"
                                        : t.expired
                                            ? "UNLOCKABLE"
                                            : "LOCKED";

                                    const statusClass = a.keyRevealed
                                        ? "text-blue-400 border-blue-500/30 bg-blue-500/10"
                                        : t.expired
                                            ? "text-green-400 border-green-500/30 bg-green-500/10"
                                            : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";

                                    const listing = onChainListings?.find(l => l.listingId?.toString() === a.listingId);
                                    const isWhistleblower = listing?.isTimelockEnabled;

                                    return (
                                        <button
                                            key={a.id}
                                            onClick={() => {
                                                setSelectedAssetId(a.id);
                                                setStep(a.keyRevealed ? 3 : 2);
                                            }}
                                            className={`text-left rounded-2xl p-5 border transition ${isSelected
                                                ? "border-cyan-500/60 bg-cyan-500/10"
                                                : "border-white/10 bg-white/5 hover:bg-white/10"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-white font-semibold truncate">
                                                        {a.fileName}
                                                    </div>
                                                    <div className="text-gray-500 text-xs mt-1">
                                                        {a.price && a.price > 0n
                                                            ? `${formatEther(a.price)} ETH`
                                                            : "Free"}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span
                                                        className={`text-xs font-semibold px-2 py-1 rounded-full border whitespace-nowrap ${statusClass}`}
                                                    >
                                                        {statusLabel}
                                                    </span>

                                                    <motion.button
                                                        type="button"
                                                        onClick={(e: any) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            shareAsset(a);
                                                        }}
                                                        whileHover={{ scale: 1.06 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold whitespace-nowrap"
                                                        title="Copy share link"
                                                    >
                                                        {copiedId === a.id ? "✅ Copied" : "🔗 Share"}
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <div className="mt-4 bg-black/30 border border-white/10 rounded-xl p-3">
                                                {a.keyRevealed ? (
                                                    <div className="text-blue-400 text-sm font-semibold">
                                                        🔓 Key revealed
                                                    </div>
                                                ) : t.expired ? (
                                                    <div className="text-green-400 text-sm font-semibold">
                                                        ✅ Ready to unlock
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-300 text-sm">
                                                        Unlocks in{" "}
                                                        <span className="text-cyan-400 font-semibold">
                                                            {t.days}d {String(t.hours).padStart(2, "0")}h{" "}
                                                            {String(t.minutes).padStart(2, "0")}m
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="text-gray-500 text-xs mt-1">
                                                    {new Date(a.unlockTime).toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="mt-3 text-cyan-400/70 text-xs font-mono truncate">
                                                {a.id}
                                            </div>
                                            {isWhistleblower && (
                                                <div className="mt-2 flex items-center gap-1.5 text-xs">
                                                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 font-semibold">
                                                        🔓 AUTO-RELEASE
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Info Box */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">ℹ️</span>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Demo Mode</h3>

                                <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
                                    <p>
                                        This is a demonstration playground. In production, your content would be{" "}
                                        <span className="text-white/90 font-medium">encrypted</span> and stored on{" "}
                                        <span className="text-white/90 font-medium">IPFS/Arweave</span>, with time-locks enforced by{" "}
                                        <span className="text-white/90 font-medium">Solidity smart contracts</span>.
                                    </p>

                                    <p>
                                        <span className="text-white/90 font-medium">What happens in this demo:</span>
                                        <br />
                                        • We store the uploaded file locally in your browser using{" "}
                                        <span className="text-white/90 font-medium">IndexedDB</span> (so it survives refreshes).<br />
                                        • We generate a random 32-byte key + salt locally and commit it on-chain via{" "}
                                        <span className="text-white/90 font-medium">keyCommitment</span>.<br />
                                        • The secret (key + salt) is stored locally (not on-chain) so only this browser can reveal it.
                                    </p>

                                    <p>
                                        <span className="text-white/90 font-medium">Important:</span> the share link only contains the{" "}
                                        <span className="text-white/90 font-medium">listingId</span>. Anyone can view the listing on-chain,
                                        but only the browser that created the listing has the local secret + file for this demo.
                                    </p>

                                    <p className="text-gray-500">
                                        Tip: If you clear site data or switch browsers/devices, the locally stored demo file/key will be
                                        gone — the on-chain listing still exists, but you won’t be able to download/reveal from this demo storage.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PlaygroundPage;

type MaskIconProps = {
    src: string;
    size?: number;
    className?: string;
};

export function MaskIcon({ src, size = 22, className = "bg-white" }: MaskIconProps) {
    return (
        <span
            className={`inline-flex items-center justify-center ${className}`}
            style={{
                width: size,
                height: size,
                WebkitMask: `url(${src}) no-repeat center / contain`,
                mask: `url(${src}) no-repeat center / contain`,
            }}
            aria-hidden="true"
        />
    );
}
