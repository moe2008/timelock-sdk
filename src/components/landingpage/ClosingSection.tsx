"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { configDotenv } from 'dotenv';


// Custom Toast Notification Component
export const Toast: React.FC<{
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}> = ({ message, type, onClose }) => {
    const router = useRouter()
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'from-emerald-500/20 to-green-500/20 border-emerald-500/50',
        error: 'from-red-500/20 to-pink-500/20 border-red-500/50',
        info: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/50',
    };

    const icons = {
        success: '🎉',
        error: '⚠️',
        info: '💡',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-8 right-8 z-[100] max-w-md bg-gradient-to-r ${bgColors[type]} backdrop-blur-xl border rounded-2xl p-6 shadow-2xl`}
        >
            <div className="flex items-center gap-4">
                <span className="text-4xl">{icons[type]}</span>
                <p className="text-white font-medium flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition"
                >
                    ✕
                </button>
            </div>
        </motion.div>
    );
};

const ClosingSection: React.FC = () => {
    const router = useRouter();
    const [mounted, setMounted] = useState<boolean>(false);
    const [selectedAmount, setSelectedAmount] = useState<number>(0.01);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
    } | null>(null);

    const { address, isConnected } = useAccount();
    const { data: hash, sendTransaction } = useSendTransaction();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    //
    useEffect(() => {
        setMounted(true);
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
    };

    const socialLinks = [
        { icon: '𝕏', name: 'Twitter', url: '#' },
        { icon: '⌘', name: 'GitHub', url: '#' },
        { icon: '◆', name: 'Etherscan', url: '#' },
    ];

    const footerLinks = {
        Product: [
            { name: 'Features', link: '#features' },
            { name: 'How It Works', link: '#howitworks' },
            { name: 'Use Cases', link: '#usecases' },
            { name: 'Smart Contract', link: '#whitepaper' }
        ],
        Resources: [
            { name: 'Documentation', link: '/docs' },
            { name: 'Whitepaper', link: '/whitepaper' },
            { name: 'GitHub', link: '#' },
            { name: 'Etherscan', link: '#' }
        ],
    };

    const ethAmounts = [
        { eth: 0.001, usd: '~$3' },
        { eth: 0.01, usd: '~$30' },
        { eth: 0.05, usd: '~$150' },
        { eth: 0.1, usd: '~$300' },
    ];

    const handleSendCrypto = async () => {
        if (!isConnected) {
            showToast('🔌 Whoa there! Connect your wallet first to unlock the magic ✨', 'info');
            return;
        }

        const amountToSend = customAmount ? parseFloat(customAmount) : selectedAmount;

        if (isNaN(amountToSend) || amountToSend <= 0) {
            showToast('🤔 Hmm... Pick a valid amount or we can\'t send this to the blockchain!', 'error');
            return;
        }

        try {
            sendTransaction({
                to: process.env.wallet as `0x${string}`,
                value: parseEther(amountToSend.toString()),
            });
            showToast('🚀 Transaction launching to the blockchain... Buckle up!', 'info');
        } catch (error: any) {
            console.error('Transaction failed:', error);
            showToast(`💥 Oops! Transaction failed: ${error?.message || 'Something went wrong'}`, 'error');
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            showToast('🎊 You\'re a legend! Thanks for supporting TimeLock! 💎', 'success');
        }
    }, [isConfirmed]);

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <>
            {/* Toast Notifications */}
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <section className="relative w-full min-h-screen bg-black overflow-hidden">
                {/* Top Fade-In Overlay */}
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black via-black/60 to-transparent z-[5] pointer-events-none" />

                {/* Background Image - Top Left Positioned */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 z-0"
                    style={{
                        width: "65%",
                        height: "65%",
                        maxWidth: "850px",
                        maxHeight: "850px",
                    }}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src="/P4.jpg"
                            alt="Background"
                            fill
                            className="object-contain object-top-left"
                            style={{
                                opacity: 0.6,
                                filter: "blur(3px)",
                                maskImage: "radial-gradient(ellipse at 15% 15%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0) 65%)",
                                WebkitMaskImage: "radial-gradient(ellipse at 15% 15%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0) 65%)",
                            }}
                            priority
                        />
                    </div>

                    <div
                        className="absolute inset-0 bg-gradient-radial from-cyan-900/15 via-blue-950/8 to-transparent"
                        style={{
                            filter: "blur(120px)",
                        }}
                    />
                </motion.div>

                {/* Gradient Mesh Background */}
                <div className="absolute inset-0 opacity-30">
                    <motion.div
                        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
                        }}
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 60, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
                        }}
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                <div className="relative z-10 container mx-auto px-8 py-20 lg:py-32">
                    {/* Crypto Support Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="max-w-4xl mx-auto text-center mb-32"
                    >
                        {/* Send Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center justify-center w-24 h-24 mb-8 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full"
                        >
                            <motion.span
                                animate={{
                                    rotate: [0, -10, 10, -10, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <span
                                    className="w-12 h-12 bg-white inline-block"
                                    style={{
                                        WebkitMask: "url(/icons/SVG/send.svg) no-repeat center / contain",
                                        mask: "url(/icons/SVG/send.svg) no-repeat center / contain",
                                    }}
                                />
                            </motion.span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
                        >
                            Enjoying
                            <br />
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                TimeLock?
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-gray-400 text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
                        >
                            Support the development of TimeLock and help us keep building
                            the future of decentralized content publishing.
                        </motion.p>

                        {!isConnected ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                viewport={{ once: true }}
                                className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl max-w-md mx-auto"
                            >
                                <p className="text-gray-400 mb-4">
                                    Please connect your wallet using the button in the navigation to support TimeLock.
                                </p>
                                <div className="text-6xl mb-4">👆</div>
                                <p className="text-sm text-gray-500">
                                    Connect wallet → Select amount → Send ETH
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                {/* ETH Amount Selection */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    viewport={{ once: true }}
                                    className="mb-8"
                                >
                                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                                        {ethAmounts.map((amount) => (
                                            <motion.button
                                                key={amount.eth}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setSelectedAmount(amount.eth);
                                                    setCustomAmount('');
                                                }}
                                                className={`px-6 py-4 rounded-2xl font-semibold transition ${selectedAmount === amount.eth && !customAmount
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                                                    : 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-white'
                                                    }`}
                                            >
                                                <div className="text-xl font-bold">
                                                    {amount.eth} ETH
                                                </div>
                                                <div className="text-xs opacity-70">
                                                    {amount.usd}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Custom Amount Input */}
                                    <div className="max-w-md mx-auto">
                                        <input
                                            type="number"
                                            step="0.001"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            placeholder="Or enter custom amount in ETH"
                                            className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition text-center"
                                        />
                                    </div>
                                </motion.div>

                                {/* Send Transaction Button */}
                                <motion.button
                                    onClick={handleSendCrypto}
                                    disabled={isConfirming}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    viewport={{ once: true }}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 0 40px rgba(6, 182, 212, 0.6)",
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-semibold rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isConfirming ? (
                                        <>
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <span
                                                    className="w-6 h-6 bg-white inline-block"
                                                    style={{
                                                        WebkitMask: "url(/icons/SVG/send.svg) no-repeat center / contain",
                                                        mask: "url(/icons/SVG/send.svg) no-repeat center / contain",
                                                    }}
                                                />
                                            </motion.span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span
                                                className="w-6 h-6 bg-white inline-block"
                                                style={{
                                                    WebkitMask: "url(/icons/SVG/send.svg) no-repeat center / contain",
                                                    mask: "url(/icons/SVG/send.svg) no-repeat center / contain",
                                                }}
                                            />
                                            Send {customAmount || selectedAmount} ETH
                                        </>
                                    )}
                                </motion.button>

                                {/* Transaction Status */}
                                {hash && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl max-w-lg mx-auto"
                                    >
                                        <p className="text-cyan-400 text-sm mb-2">
                                            {isConfirming && '⏳ Waiting for blockchain confirmation...'}
                                            {isConfirmed && '✓ Transaction confirmed! Thank you! 🎉'}
                                        </p>
                                        <a
                                            href={`https://etherscan.io/tx/${hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-cyan-300 text-xs underline hover:text-cyan-200 transition"
                                        >
                                            View on Etherscan
                                        </a>
                                    </motion.div>
                                )}

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    viewport={{ once: true }}
                                    className="text-gray-500 text-sm mt-6"
                                >
                                    ✓ Direct to wallet  •  ✓ No intermediaries  •  ✓ 100% goes to development
                                </motion.p>

                                {/* Connected Wallet Display */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6 text-gray-500 text-xs"
                                >
                                    Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                                </motion.div>
                            </>
                        )}
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-32"
                    >
                        {[
                            { value: '100%', label: 'Censorship Resistant' },
                            { value: '∞', label: 'Storage Duration' },
                            { value: '24/7', label: 'Community Support' },
                            { value: '0', label: 'Trust Required' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-cyan-500/30 transition"
                            >
                                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Footer */}
                    <div className="border-t border-white/10 pt-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                            {/* Logo & Description */}
                            <div className="col-span-1 md:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-3 mb-6"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">⏰</span>
                                    </div>
                                    <span className="text-white text-2xl font-bold">TimeLock</span>
                                </motion.div>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    Decentralized time-locked content marketplace.
                                    Built on blockchain technology for guaranteed, censorship-resistant content delivery.
                                </p>
                                {/* Social Links */}
                                <div className="flex gap-3">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.url}
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/50 transition"
                                        >
                                            {social.icon}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Links */}
                            {Object.entries(footerLinks).map(([category, links], index) => (
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                                        {category}
                                    </h4>
                                    <ul className="space-y-3">
                                        {links.map((item, linkIndex) => {
                                            const isExternalRoute = item.link.startsWith('/');
                                            const isAnchor = item.link.startsWith('#');

                                            return (
                                                <li key={linkIndex}>
                                                    {isExternalRoute ? (
                                                        <motion.button
                                                            onClick={() => handleNavigation(item.link)}
                                                            whileHover={{ x: 2 }}
                                                            className="text-gray-400 hover:text-white text-sm transition cursor-pointer text-left"
                                                        >
                                                            {item.name}
                                                        </motion.button>
                                                    ) : isAnchor ? (
                                                        <motion.a
                                                            href={item.link}
                                                            whileHover={{ x: 2 }}
                                                            className="text-gray-400 hover:text-white text-sm transition cursor-pointer block"
                                                        >
                                                            {item.name}
                                                        </motion.a>
                                                    ) : (
                                                        <motion.a
                                                            href={item.link}
                                                            whileHover={{ x: 2 }}
                                                            className="text-gray-400 hover:text-white text-sm transition"
                                                        >
                                                            {item.name}
                                                        </motion.a>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom Bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10"
                        >
                            <p className="text-gray-500 text-sm mb-4 md:mb-0">
                                © 2026 TimeLock. Decentralized and open source.
                            </p>
                            <div className="flex gap-6">
                                <a href="#" className="text-gray-500 hover:text-white text-sm transition">
                                    Smart Contract Audit
                                </a>
                                <a href="#" className="text-gray-500 hover:text-white text-sm transition">
                                    Open Source
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Floating Elements */}
                {
                    [...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0, 0.8, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                                ease: "easeInOut"
                            }}
                        />
                    ))
                }
            </section >
        </>
    );
};

export default ClosingSection;