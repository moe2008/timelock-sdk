"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';

type MaskIconProps = {
    src: string;
    size?: number;
    className?: string;
};

const MaskIcon = ({ src, size = 28, className = "bg-cyan-400" }: MaskIconProps) => (
    <span
        className={`inline-flex ${className}`}
        style={{
            width: size,
            height: size,
            WebkitMask: `url(${src}) no-repeat center / contain`,
            mask: `url(${src}) no-repeat center / contain`,
        }}
        aria-hidden="true"
    />
);

interface FeatureCard {
    title: string;
    description: string;
    position: 'topLeft' | 'center' | 'bottomRight';
    icon: string;
}

const ServicesSection: React.FC = () => {
    const [mounted, setMounted] = useState<boolean>(false);
    const controls = useAnimation();

    useEffect(() => {
        setMounted(true);
        controls.start('visible');
    }, [controls]);
    const features: FeatureCard[] = [
        {
            title: 'WHISTLEBLOWER PROTECTION',
            description: 'Secure mechanism with dead-man switch for anonymous, time-locked document releases',
            position: 'topLeft',
            icon: '/icons/SVG/binary.svg',
        },
        {
            title: 'RESEARCH PUBLICATIONS',
            description: 'Academic papers and findings released at exact publication dates with patent protection',
            position: 'center',
            icon: '/icons/SVG/vision.svg',
        },
        {
            title: 'LEAK-RESISTANT JOURNALISM',
            description: 'Investigative reports auto-publish at set times, preventing suppression attempts',
            position: 'bottomRight',
            icon: '/icons/SVG/document.svg',
        },
    ];


    const getCardPosition = (position: string) => {
        switch (position) {
            case 'topLeft':
                return 'top-8 left-8 lg:top-12 lg:left-16';
            case 'center':
                return 'bottom-8 left-1/2 -translate-x-1/2 lg:bottom-16';
            case 'bottomRight':
                return 'top-1/3 right-8 lg:right-16 lg:top-1/2 -translate-y-1/2';
            default:
                return '';
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-black px-4 py-20 lg:py-32 overflow-hidden" id='usecases'>
            {/* Animated Background Gradient Mesh */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="relative w-full h-full">
                        <Image
                            src="/P3.jpg"
                            alt="Background"
                            fill
                            className="object-contain"
                            style={{
                                opacity: 0.85,
                                filter: "blur(4px)",
                                maskImage: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 70%)",
                                WebkitMaskImage: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 70%)",
                            }}
                            priority
                        />
                    </div>
                    <motion.div
                        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
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
                    <motion.div
                        className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
                        }}
                        animate={{
                            x: [0, -100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full -translate-x-1/2 -translate-y-1/2"
                        style={{
                            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
                        }}
                        animate={{
                            scale: [1, 1.4, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </div>

            {/* Noise Texture Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'4.5\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                }}
            />

            <div className="relative max-w-7xl mx-auto z-10">
                {/* Header */}
                <div className="text-center mb-20 lg:mb-28">
                    <motion.div
                        className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="relative">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                            <div className="absolute inset-0 w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                        </div>
                        <span className="text-white/70 text-xs uppercase tracking-[0.2em] font-semibold">
                            Use Cases
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-6xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.9]"
                        style={{
                            textShadow: '0 0 80px rgba(6, 182, 212, 0.5)',
                        }}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        Real-World Applications<br />
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            That Matter
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-white/50 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: mounted ? 1 : 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        From investigative journalism to academic research, our platform serves those who need absolute certainty in content delivery
                    </motion.p>
                </div>

                {/* Main Visual Container */}
                <motion.div
                    className="relative w-full max-w-6xl mx-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
                    transition={{ duration: 1.2, delay: 0.8 }}
                >
                    {/* Main Dashboard Container */}
                    <div className="relative aspect-video rounded-3xl overflow-hidden group">
                        {/* Animated Border Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-700" />

                        {/* Main Content Box */}
                        <div className="relative w-full h-full m-[2px] rounded-3xl bg-black/90 backdrop-blur-2xl border border-white/10 overflow-hidden">
                            {/* Dynamic Grid Background */}
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '60px 60px',
                                }}
                            />

                            {/* Scanning Line Effect */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                                animate={{
                                    y: [0, 700, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />

                            {/* Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-blue-900/20" />
                            <div className="absolute inset-0 bg-gradient-to-tl from-purple-900/10 via-transparent to-transparent" />

                            {/* Center Mock Dashboard */}
                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <motion.div
                                    className="relative"
                                    animate={{
                                        scale: [1, 1.02, 1],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {/* Mock Lock Icon */}
                                    <div className="text-9xl opacity-10 text-cyan-500">
                                        🔒
                                    </div>
                                </motion.div>
                            </div>

                            {/* Floating Particles */}
                            {[...Array(15)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        y: [0, -100, 0],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Feature Cards */}
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className={`absolute ${getCardPosition(feature.position)} w-80 lg:w-96 z-20`}
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{
                                opacity: mounted ? 1 : 0,
                                scale: mounted ? 1 : 0.8,
                                y: mounted ? 0 : 50
                            }}
                            transition={{
                                duration: 0.8,
                                delay: 1.4 + index * 0.2,
                                type: "spring",
                                stiffness: 100
                            }}
                        >
                            <motion.div
                                className="relative group"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Glow Effect on Hover */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                                {/* Card Content */}
                                <div className="relative bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 overflow-hidden group-hover:border-cyan-500/50 transition-all duration-300">
                                    {/* Shimmer Effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                                        animate={{
                                            x: [-200, 400],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatDelay: 2,
                                        }}
                                    />

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="flex items-start gap-4 mb-3">
                                            {/* Icon with Glow */}
                                            <motion.div
                                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                                                animate={{ rotate: [0, 5, -5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                            >
                                                <MaskIcon
                                                    src={feature.icon}
                                                    size={22}
                                                    className="bg-cyan-400"
                                                />
                                            </motion.div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <motion.div
                                                        className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                                                        animate={{
                                                            boxShadow: [
                                                                '0 0 5px rgba(6, 182, 212, 0.5)',
                                                                '0 0 20px rgba(6, 182, 212, 1)',
                                                                '0 0 5px rgba(6, 182, 212, 0.5)',
                                                            ]
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                    />
                                                    <h3 className="text-white/90 text-xs font-bold uppercase tracking-[0.15em]">
                                                        {feature.title}
                                                    </h3>
                                                </div>
                                                <p className="text-white/50 text-sm leading-relaxed font-light">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Accent Line */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"
                                        initial={{ width: 0 }}
                                        whileHover={{ width: '100%' }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}

                    {/* Corner Decorations */}
                    <motion.div
                        className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: mounted ? 1 : 0 }}
                        transition={{ duration: 1, delay: 2 }}
                    />
                    <motion.div
                        className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-blue-500/30 rounded-br-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: mounted ? 1 : 0 }}
                        transition={{ duration: 1, delay: 2.2 }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default ServicesSection;