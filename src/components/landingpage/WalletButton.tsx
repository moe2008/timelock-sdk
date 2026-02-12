"use client";

import { motion } from "framer-motion";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletButton() {
    const { address, isConnected } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const { disconnect } = useDisconnect();

    const short = (addr?: string) =>
        addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

    if (!isConnected) {
        return (
            <motion.button
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => connect({ connector: connectors[0] })}
                disabled={isPending}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition font-semibold disabled:opacity-50"
            >
                {isPending ? "Connecting…" : "Connect Wallet"}
            </motion.button>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => disconnect()}
            className="hidden md:flex items-center gap-2 bg-black/40 border border-cyan-500/40 text-white px-6 py-3 rounded-full backdrop-blur-xl hover:border-cyan-400 transition font-semibold"
        >
            {short(address)}
            <span className="text-cyan-400 text-sm">Disconnect</span>
        </motion.button>
    );
}
