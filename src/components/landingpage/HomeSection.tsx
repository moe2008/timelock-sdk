"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { WalletButton } from "./WalletButton";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Status = "locked" | "pending" | "scheduled" | "disclosed";

export default function HomeSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: 0.5, y: 0.5 });
    const heroRef = useRef<HTMLDivElement | null>(null);
    const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
    const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 5, minutes: 23, seconds: 45 });
    const router = useRouter()

    // Countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        } else {
                            hours = 23;
                            if (days > 0) {
                                days--;
                            }
                        }
                    }
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [])

    type LockedCard = {
        title: string;
        type: string;
        unlockIn: string;
        status: Status;
        trend: string;
    };

    const lockedContent: LockedCard[] = [
        { title: "Whistleblower Docs", type: "DOCUMENTS", unlockIn: "3d 12h", status: "locked", trend: "protected" },
        { title: "Research Paper", type: "ACADEMIC", unlockIn: "7d 05h", status: "locked", trend: "pending" },
        { title: "Album Release", type: "MUSIC", unlockIn: "14d 18h", status: "disclosed", trend: "scheduled" },
        { title: "Code Vulnerability", type: "SECURITY", unlockIn: "90d 00h", status: "disclosed", trend: "disclosed" },
    ];
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) return;

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();

        const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 resolution;
      uniform vec2 mouse;

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 center = mouse;

        float dist = distance(uv, center);
        float strength = smoothstep(0.3, 0.0, dist);

        vec2 direction = normalize(uv - center);
        float distortion = strength * 0.02;

        vec2 distortedUV = uv + direction * sin(dist * 30.0) * distortion;

        float glow = strength * 0.15;

        gl_FragColor = vec4(vec3(glow), 0.1 + glow);
      }
    `;

        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        if (!buffer) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const resolutionLocation = gl.getUniformLocation(program, "resolution");
        const mouseLocation = gl.getUniformLocation(program, "mouse");
        if (!resolutionLocation || !mouseLocation) return;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        let rafId = 0;

        const animate = () => {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform2f(mouseLocation, mousePos.current.x, 1.0 - mousePos.current.y);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            rafId = requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            };
        };

        const handleResize = () => setSize();

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <section className="relative w-screen min-h-screen">
            <motion.div className="w-full h-full relative">
                {/* Background Image */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <Image src="/P1.jpg" alt="Background" fill className="object-cover brightness-50" priority />
                </motion.div>

                {/* Dark Overlay */}
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 bg-black z-[1]"
                />

                {/* Distortion Shader */}
                <motion.canvas
                    ref={canvasRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    className="absolute inset-0 w-full h-full backdrop-blur-[2px] z-[2] pointer-events-none"
                />

                {/* Content */}
                <div className="relative z-20 isolate min-h-screen flex flex-col justify-between py-28">
                    <div ref={heroRef} className="flex flex-col items-center justify-center text-center px-8 flex-1">
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={isHeroInView ? { scale: 1, opacity: 1 } : {}}
                                transition={{ duration: 0.7, delay: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                                className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full px-4 py-2"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                    <span
                                        className="w-2 h-2 bg-white inline-block"
                                        style={{
                                            WebkitMask: "url(/icons/SVG/digitalkey.svg) no-repeat center / contain",
                                            mask: "url(/icons/SVG/digitalkey.svg) no-repeat center / contain",
                                        }}
                                    />
                                </div>
                                <span className="text-white text-sm">Time-Locked Content</span>
                            </motion.div>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1, delay: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
                            className="text-7xl font-bold text-white mb-6 leading-tight"
                        >
                            Content That Unlocks<br />At The Perfect Time
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.9, delay: 2.1, ease: [0.25, 0.1, 0.25, 1] }}
                            className="text-gray-400 text-lg max-w-2xl mb-12"
                        >
                            Leak-resistant, blockchain-guaranteed content releases. Perfect for whistleblowers,<br />
                            researchers, and creators who need absolute certainty.
                        </motion.p>

                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={isHeroInView ? { scale: 1, opacity: 1 } : {}}
                            transition={{ duration: 0.7, delay: 1.6, ease: [0.34, 1.56, 0.64, 1] }}
                            className="w-full flex justify-center mb-8"
                        >
                            <InstallClipboard />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 2.4, ease: [0.25, 0.1, 0.25, 1] }}
                            className="flex flex-wrap items-center justify-center gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(6, 182, 212, 0.8)", transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition flex items-center gap-2 text-lg font-semibold"
                                onClick={() => router.push("/playground")}
                            >
                                Lock Your Content
                                <motion.svg
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </motion.svg>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, borderColor: "#ffffff", transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                                className="border border-gray-600 text-white px-8 py-4 rounded-full hover:border-white transition text-lg font-semibold"
                                onClick={() => router.push("/whitepaper")}
                            >
                                Learn More
                            </motion.button>

                            <motion.a
                                href="https://github.com/moe2008/timelock"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05, borderColor: "#22c55e", transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                                className="border border-green-600 text-white px-8 py-4 rounded-full hover:border-green-500 transition text-lg font-semibold flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                View on GitHub
                            </motion.a>
                        </motion.div>
                    </div>

                    {/* Locked Content Cards Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.2, delay: 2.7, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden relative mt-8"
                    >
                        <div className="flex gap-6 animate-scroll-seamless">
                            {[...lockedContent, ...lockedContent, ...lockedContent].map((card, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.6, delay: 2.9 + (index % 4) * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                                    whileHover={{ scale: 1.05, borderColor: "rgba(6, 182, 212, 0.5)", transition: { duration: 0.2 } }}
                                    className="min-w-[320px] md:min-w-[360px] bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-cyan-500/40 transition flex-shrink-0"

                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <motion.div
                                                whileHover={{ rotate: 6 }}
                                                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
                                            >
                                                <StatusIcon status={card.status} size={20} />
                                            </motion.div>

                                            <div className="min-w-0">
                                                <h3 className="text-white font-semibold leading-5 truncate">{card.title}</h3>
                                                <p className="text-gray-400 text-xs mt-1 tracking-wide">{card.type}</p>
                                            </div>
                                        </div>

                                        <span className="shrink-0 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                                            {card.trend}
                                        </span>
                                    </div>

                                    <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4">
                                        <div className="flex items-baseline justify-between gap-3">
                                            <span className="text-gray-400 text-xs">Unlocks in</span>
                                            <span className="text-gray-500 text-[11px]">On-chain</span>
                                        </div>

                                        <div className="mt-2 text-2xl font-bold text-white tracking-tight">
                                            {card.unlockIn}
                                        </div>

                                        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                                            <span>Auto-release</span>
                                            <span className="text-cyan-300/80">Secured</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <style jsx>{`
          @keyframes scroll-seamless {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-350px * 4 - 24px * 4));
            }
          }

          .animate-scroll-seamless {
            animation: scroll-seamless 20s linear infinite;
            display: flex;
          }

          .animate-scroll-seamless:hover {
            animation-play-state: paused;
          }
        `}</style>
            </motion.div>
        </section>
    );
}

type NavItem = {
    label: string;
    href: string;
};

const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Whitepaper", href: "/whitepaper" },
    { label: "Playground", href: "/playground" },
    { label: "Docs", href: "/docs" },
];

function isActive(pathname: string, href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
}

export function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // close mobile menu on route change
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // esc to close
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 md:py-6"
        >
            <div className="mx-auto w-full max-w-7xl">
                {/* MOBILE: flex (logo links, actions rechts) */}
                <div className="flex items-center justify-between md:hidden">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer">
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                <span
                                    className="w-4 h-4 bg-white inline-block"
                                    style={{
                                        WebkitMask: "url(/icons/SVG/digitalkey.svg) no-repeat center / contain",
                                        mask: "url(/icons/SVG/digitalkey.svg) no-repeat center / contain",
                                    }}
                                />
                            </div>
                            <span className="text-white text-xl font-bold">TimeLock</span>
                        </motion.div>
                    </Link>

                    <div className="flex items-center gap-3">
                        <WalletButton />

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Open menu"
                            aria-expanded={open}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-white"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </motion.button>
                    </div>
                </div>

                {/* DESKTOP: grid (logo links, nav mitte, wallet rechts) */}
                <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center">
                    {/* Logo -> / */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 cursor-pointer">
                            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                    <span
                                        className="w-4 h-4 bg-white inline-block"
                                        style={{
                                            WebkitMask: "url(/icons/SVG/digitalkey.svg) no-repeat center / contain",
                                            mask: "url(/icons/SVG/digitalkey.svg) no-repeat center / contain",
                                        }}
                                    />
                                </div>
                                <span className="text-white text-2xl font-bold">TimeLock</span>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Center nav (desktop) */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 2 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-cyan-500/30 rounded-full px-8 py-3 shadow-lg shadow-cyan-500/10"
                    >
                        {navItems.map((item) => {
                            const active = isActive(pathname, item.href);

                            return (
                                <motion.div key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href={item.href}
                                        aria-current={active ? "page" : undefined}
                                        className={[
                                            "px-5 py-2 font-medium rounded-full transition-all duration-300",
                                            active
                                                ? "text-white bg-cyan-500/30 hover:bg-cyan-500/50"
                                                : "text-gray-300 hover:bg-white/10 hover:text-white",
                                        ].join(" ")}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Right */}
                    <div className="justify-self-end">
                        <WalletButton />
                    </div>
                </div>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.button
                            aria-label="Close menu"
                            onClick={() => setOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.98 }}
                            transition={{ duration: 0.18 }}
                            className="md:hidden relative z-50 mt-4 mx-auto max-w-7xl px-4"
                        >
                            <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-3">
                                <div className="flex flex-col gap-1">
                                    {navItems.map((item) => {
                                        const active = isActive(pathname, item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={[
                                                    "px-4 py-3 rounded-xl transition flex items-center justify-between",
                                                    active ? "bg-cyan-500/20 text-white" : "text-gray-200 hover:bg-white/10",
                                                ].join(" ")}
                                            >
                                                <span className="font-medium">{item.label}</span>
                                                {active && <span className="text-cyan-300 text-sm">active</span>}
                                            </Link>
                                        );
                                    })}

                                    {/* GitHub link in mobile menu */}
                                    <a
                                        href="https://github.com/yourusername/timelock"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-3 rounded-xl transition flex items-center justify-between text-gray-200 hover:bg-green-500/10 border-t border-white/10 mt-2 pt-4"
                                    >
                                        <span className="font-medium flex items-center gap-2">
                                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                            View on GitHub
                                        </span>
                                        <span className="text-green-300 text-sm">Open Source</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

const STATUS_COLOR: Record<Status, string> = {
    locked: "bg-cyan-400",
    pending: "bg-yellow-400",
    scheduled: "bg-blue-400",
    disclosed: "bg-red-400",
};

type StatusIconProps = {
    status: Status;
    size?: number;
};

export function StatusIcon({ status, size = 16 }: StatusIconProps) {
    return (
        <span
            aria-label={`status-${status}`}
            className={`inline-block ${STATUS_COLOR[status]}`}
            style={{
                width: size,
                height: size,
                WebkitMask: "url(/icons/SVG/password.svg) no-repeat center / contain",
                mask: "url(/icons/SVG/password.svg) no-repeat center / contain",
            }}
        />
    );
}

function InstallClipboard() {
    const [copied, setCopied] = useState<"sdk" | "react" | null>(null);

    const items = [
        { key: "sdk" as const, label: "SDK", cmd: "npm i @webdrei/timelock-content-sdk" },
        { key: "react" as const, label: "React", cmd: "npm i @webdrei/timelock-content-react" },
    ];

    const copy = async (text: string, which: "sdk" | "react") => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        } finally {
            setCopied(which);
            window.setTimeout(() => setCopied(null), 900);
        }
    };

    return (
        <div className="w-full max-w-[520px] px-1">
            <div className="rounded-lg border border-white/10 bg-black/15 backdrop-blur-sm">
                <div className="px-2 py-2">
                    <div className="space-y-1.5">
                        {items.map((it) => {
                            const isCopied = copied === it.key;

                            return (
                                <div
                                    key={it.key}
                                    className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5"
                                >
                                    {/* tiny label */}
                                    <span className="shrink-0 inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-white/60">
                                        {it.label}
                                    </span>

                                    {/* command */}
                                    <div className="min-w-0 flex-1">
                                        <code className="block text-[11px] text-white/75 font-mono whitespace-nowrap overflow-x-auto no-scrollbar">
                                            {it.cmd}
                                        </code>
                                    </div>

                                    {/* compact copy */}
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => copy(it.cmd, it.key)}
                                        className={[
                                            "shrink-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold transition",
                                            "border",
                                            isCopied
                                                ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-100"
                                                : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white/85",
                                        ].join(" ")}
                                        aria-label={`copy-${it.key}`}
                                    >
                                        {isCopied ? (
                                            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3.2-3.2A1 1 0 016.304 9.29l2.493 2.493 6.493-6.493a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5h6m-6 0a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2m-6 0V3a1 1 0 011-1h4a1 1 0 011 1v2"
                                                />
                                            </svg>
                                        )}
                                        <span className="hidden sm:inline">{isCopied ? "Copied" : "Copy"}</span>
                                    </motion.button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}
