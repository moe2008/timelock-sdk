"use client";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { StatusIcon } from "./HomeSection";

export default function FeaturesSection() {
    const sectionRef = useRef(null);

    // Scroll Progress für diese Section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Smooth Spring Animation
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // ============================================
    // NUR BRIGHTNESS TRANSFORMATION (keine Position/Scale)
    // ============================================
    const bgBrightness = useTransform(smoothProgress, [0, 0.5, 1], [0.6, 1.2, 0.6]);

    const features = [
        { iconSrc: "/icons/SVG/padlock.svg", text: "Guaranteed Time-Lock Release", color: "from-cyan-500 to-blue-600" },
        { iconSrc: "/icons/SVG/auction.svg", text: "Leak-Resistant Encryption", color: "from-blue-500 to-purple-600" },
        { iconSrc: "/icons/SVG/maintenance.svg", text: "Optional Self-Destruct Clause", color: "from-purple-500 to-pink-600" },
    ];
    const stats = [
        { value: "100%", label: "Censorship Resistant" },
        { value: "∞", label: "Storage Duration" },
        { value: "0", label: "Trust Required" },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen bg-black overflow-hidden px-4 md:px-8"
            id="features"
        >
            {/* ============================================ */}
            {/* STATISCHES BACKGROUND - NUR BRIGHTNESS ÄNDERT SICH */}
            {/* ============================================ */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">

                <div className="relative w-full h-full">
                    <Image
                        src="/P2.jpg"
                        alt="Background"
                        fill
                        className="object-contain"
                        style={{
                            opacity: 0.55,
                            filter: "blur(2px)",
                            maskImage: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 70%)",
                            WebkitMaskImage: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 70%)",
                        }}
                        priority
                    />
                </div>

            </div>

            {/* CONTENT LAYER */}
            <div className="relative z-10 min-h-screen flex items-center justify-center py-12 md:py-20">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">

                        {/* LEFT SIDE - Text Content */}
                        <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true, amount: 0.8 }}
                                className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold"
                            >
                                <span className="text-xl">✦</span>
                                <span>Features</span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true, amount: 0.8 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                            >
                                DON'T JUST RELEASE CONTENT,
                                <br />
                                GUARANTEE IT.
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true, amount: 0.8 }}
                                className="text-base md:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
                            >
                                Built for whistleblowers, researchers, and creators. Experience unstoppable
                                content releases with blockchain-backed guarantees and cryptographic security.
                            </motion.p>

                            {/* CTA Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true, amount: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg shadow-lg shadow-cyan-500/30"
                            >
                                Explore More
                            </motion.button>

                            {/* Tagline */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="text-gray-500 text-sm italic"
                            >
                                Content That Can't Be Stopped
                            </motion.p>
                        </div>

                        {/* RIGHT SIDE - Features & Card */}
                        <div className="space-y-6 md:space-y-8">
                            {/* Features List */}
                            <div className="space-y-3 md:space-y-4">
                                {features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true, amount: 0.8 }}
                                        className="flex items-center gap-3 md:gap-4 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-3 md:p-4 hover:border-cyan-500/50 transition-colors"
                                    >
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                            <MaskIcon src={feature.iconSrc} size={22} className="bg-white" />
                                        </div>
                                        <span className="text-white font-medium text-sm md:text-base">
                                            {feature.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Live Countdown Preview Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true, amount: 0.5 }}
                                className="bg-gradient-to-br from-cyan-900/40 to-blue-950/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 md:p-6 shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-white font-semibold text-xs md:text-sm uppercase tracking-wider">
                                        Live Time-Lock Preview
                                    </span>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-cyan-500 animate-pulse" />
                                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-400 opacity-50" />
                                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-300 opacity-30" />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 md:p-6 mb-4 border border-cyan-500/20">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-cyan-400 text-xs uppercase tracking-wider">Unlocks In</span>
                                        <span className="text-gray-500 text-xs">🔒 Locked</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['12d', '05h', '23m', '45s'].map((time, i) => (
                                            <div key={i} className="bg-cyan-500/10 rounded-lg p-2 text-center border border-cyan-500/30">
                                                <div className="text-lg md:text-2xl font-bold text-cyan-400">{time}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-xs md:text-sm">📄</span>
                                    </div>
                                    <div>
                                        <span className="text-white font-semibold text-sm md:text-base">Whistleblower Document</span>
                                        <span className="text-gray-400 text-xs md:text-sm ml-2">(ENCRYPTED)</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* STATS SECTION */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true, amount: 0.8 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-20"
                    >
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-xs md:text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

type MaskIconProps = {
    src: string;          // z.B. "/icons/SVG/padlock.svg"
    size?: number;        // px
    className?: string;   // z.B. "bg-white"
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
