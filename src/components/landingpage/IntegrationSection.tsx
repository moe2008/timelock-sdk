"use client";
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

const IntegrationSection: React.FC = () => {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const steps = [
        {
            icon: '🔒',
            title: 'Lock Content',
            description: 'Upload your content and set time-lock conditions on-chain',
            detail: 'Secured via Solidity smart contracts with IPFS/Arweave storage'
        },
        {
            icon: '⏳',
            title: 'Countdown Begins',
            description: 'Content remains encrypted until unlock time',
            detail: 'Leak-resistant mechanism with optional destruction clause'
        },
        {
            icon: '🔓',
            title: 'Auto-Unlock',
            description: 'Content automatically releases when conditions are met',
            detail: 'Perfect for research, whistleblowing, or timed releases'
        }
    ];

    return (
        <section
            className="relative w-full min-h-screen bg-[#0a0a0a] overflow-hidden px-4 md:px-8"
            id='howitworks'
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute bottom-0 right-0 z-0"
                style={{
                    width: "60%",
                    height: "60%",
                    maxWidth: "800px",
                    maxHeight: "800px",
                }}
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/P5.jpg"
                        alt="Background"
                        fill
                        className="object-contain object-bottom-right"
                        style={{
                            opacity: 0.85,
                            filter: "blur(14px)",
                            maskImage: "radial-gradient(ellipse at 85% 85%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 75%)",
                            WebkitMaskImage: "radial-gradient(ellipse at 85% 85%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 75%)",
                        }}
                        priority
                    />
                </div>

                {/* Soft cyan ambient glow */}
                <div
                    className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-cyan-950/10 to-transparent"
                    style={{
                        filter: "blur(100px)",
                    }}
                />
            </motion.div>

            {/* CONTENT LAYER */}
            <div className="relative z-10 w-full min-h-screen flex items-center justify-center py-12 md:py-20">
                <div className="relative w-full max-w-7xl">

                    {/* HEADER */}
                    <div className="text-center px-4 md:px-8 mb-12 md:mb-20">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, amount: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-6 md:mb-8"
                        >
                            <span
                                className="w-4 h-4 bg-white inline-block"
                                style={{
                                    WebkitMask: "url(/icons/SVG/digitalkey.svg) no-repeat center / contain",
                                    mask: "url(/icons/SVG/digitalkey.svg) no-repeat center / contain",
                                }}
                            />
                            <span className="text-xs md:text-sm">How It Works</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true, amount: 0.8 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight"
                        >
                            Three Simple Steps to
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                Guaranteed Content Release
                            </span>
                        </motion.h2>

                        {/* Subheading */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true, amount: 0.8 }}
                            className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed"
                        >
                            Our blockchain-powered platform ensures your content releases exactly when you want it to,
                            with cryptographic guarantees that can't be tampered with or censored.
                        </motion.p>

                        {/* Decorative Line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="w-16 md:w-24 h-1 mx-auto mt-6 md:mt-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        />
                    </div>

                    {/* INFOGRAPHIC - Mobile Optimized */}
                    <div className="px-4 md:px-8 pb-32 md:pb-40">
                        {/* Mobile: Vertical Stack, Desktop: Grid */}
                        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 md:gap-12 items-center max-w-5xl mx-auto">

                            {/* Step 1 */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true, amount: 0.8 }}
                                className="text-center lg:text-right space-y-4"
                            >
                                <div className="inline-block">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-2xl md:text-3xl mb-4 shadow-lg shadow-cyan-500/20">
                                        {steps[0].icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{steps[0].title}</h3>
                                    <p className="text-sm md:text-base text-gray-400 mb-2 leading-relaxed">{steps[0].description}</p>
                                    <p className="text-xs md:text-sm text-cyan-400/70">{steps[0].detail}</p>
                                </div>
                            </motion.div>

                            {/* Center Icon */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true, amount: 0.5 }}
                                className="flex justify-center my-8 lg:my-0"
                            >
                                <div className="relative w-48 h-48 md:w-64 md:h-64">
                                    {/* Simple Glow */}
                                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl" />

                                    {/* SVG Icon */}
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <Image
                                            src="/arrowgraphics.svg"
                                            alt="Time-Lock Arrow"
                                            width={160}
                                            height={160}
                                            className="drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Step 3 */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true, amount: 0.8 }}
                                className="text-center lg:text-left space-y-4"
                            >
                                <div className="inline-block">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-2xl md:text-3xl mb-4 shadow-lg shadow-cyan-500/20">
                                        {steps[2].icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{steps[2].title}</h3>
                                    <p className="text-sm md:text-base text-gray-400 mb-2 leading-relaxed">{steps[2].description}</p>
                                    <p className="text-xs md:text-sm text-cyan-400/70">{steps[2].detail}</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Middle Step - Below Center Icon */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="mt-12 md:mt-16 max-w-md mx-auto"
                        >
                            <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-950/50 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-4 md:p-6 shadow-2xl">
                                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-500/40 to-cyan-600/40 flex items-center justify-center text-xl md:text-2xl flex-shrink-0 border border-cyan-500/30">
                                        {steps[1].icon}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white">{steps[1].title}</h3>
                                </div>
                                <p className="text-sm md:text-base text-gray-400 mb-2 leading-relaxed">{steps[1].description}</p>
                                <p className="text-xs md:text-sm text-cyan-400/70">{steps[1].detail}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* USE CASES PILLS */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-3 md:gap-4 px-4 md:px-8"
                    >
                        {['Solidity', 'Next.js', 'IPFS', 'Arweave', 'Time-Lock Contracts', 'Escrow'].map((tech, index) => (
                            <div
                                key={index}
                                className="px-4 md:px-6 py-2 md:py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 text-xs md:text-sm font-medium"
                            >
                                {tech}
                            </div>
                        ))}
                    </motion.div>

                    {/* Bottom Line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="w-16 md:w-24 h-1 mx-auto mt-12 md:mt-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    />
                </div>
            </div>
        </section >
    );
};

export default IntegrationSection;