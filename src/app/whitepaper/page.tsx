"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "../../components/landingpage/HomeSection";

const sections = [
    { id: "abstract", title: "Abstract" },
    { id: "introduction", title: "1. Introduction" },
    { id: "design-goals", title: "2. Design Goals" },
    { id: "system-overview", title: "3. System Overview" },
    { id: "cryptographic-model", title: "4. Cryptographic Model" },
    { id: "timelock-encryption", title: "4.5 Timelock Encryption" },
    { id: "commit-reveal", title: "5. Commit–Reveal Mechanism" },
    { id: "economic-model", title: "6. Economic Model" },
    { id: "smart-contract", title: "7. Smart Contract Specification" },
    { id: "sdk", title: "8. SDK Abstraction Layer" },
    { id: "storage", title: "9. Storage Model" },
    { id: "security", title: "10. Security Analysis" },
    { id: "limitations", title: "11. Limitations and Tradeoffs" },
    { id: "use-cases", title: "12. Use Cases" },
    { id: "future-work", title: "13. Future Work" },
    { id: "conclusion", title: "14. Conclusion" },
];

function GlassCard({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={[
                "bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl",
                "shadow-lg shadow-cyan-500/10",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}

function Section({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-28">
            <GlassCard className="p-7 md:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-white text-2xl md:text-3xl font-bold">{title}</h2>
                        <div className="mt-2 h-px w-full bg-gradient-to-r from-cyan-500/40 via-blue-500/20 to-transparent" />
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
                        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                            Section
                        </span>
                    </div>
                </div>
                <div className="mt-5 text-gray-300 leading-relaxed text-[15px] md:text-base space-y-4">
                    {children}
                </div>
            </GlassCard>
        </section>
    );
}

export default function WhitepaperPage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <Navbar />
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.18),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.12),transparent_50%)]" />
                <div className="absolute inset-0 bg-black" />
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
            </div>

            <div className="mx-auto w-full max-w-7xl px-6 md:px-8 pt-32 pb-20">
                {/* Header */}
                <div className="flex flex-col gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex flex-col gap-4"
                    >
                        <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 rounded-full px-4 py-2 w-fit">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                <span className="text-white text-xs">📄</span>
                            </div>
                            <span className="text-white text-sm">TimeLockContent Technical Whitepaper</span>
                            <span className="text-cyan-200/70 text-xs ml-1">v1.0</span>
                        </div>

                        <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
                            TimeLockContent Protocol
                        </h1>

                        <p className="text-gray-400 max-w-3xl text-lg">
                            A trust-minimized protocol for time-locked content releases using off-chain encryption and on-chain commitments.
                        </p>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
                                Last updated: January 2026
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
                                Chain: EVM-compatible
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
                                Type: Technical Specification
                            </span>

                            <div className="flex-1" />

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: "0 0 40px rgba(6, 182, 212, 0.35)",
                                    }}
                                    whileTap={{ scale: 0.99 }}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-2.5 rounded-full font-semibold border border-white/10"
                                    onClick={() => {
                                        window.print();
                                    }}
                                >
                                    Download PDF
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.03, borderColor: "#ffffff" }}
                                    whileTap={{ scale: 0.99 }}
                                    className="border border-gray-600 text-white px-5 py-2.5 rounded-full font-semibold hover:border-white transition"
                                    onClick={async () => {
                                        try {
                                            await navigator.clipboard.writeText(window.location.href);
                                        } catch { }
                                    }}
                                >
                                    Copy Link
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Key metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <GlassCard className="p-5">
                            <div className="text-gray-400 text-sm">Trust Model</div>
                            <div className="text-white text-2xl font-bold mt-1">Minimized</div>
                            <div className="text-cyan-200/70 text-sm mt-2">Cryptographic commitments</div>
                        </GlassCard>

                        <GlassCard className="p-5">
                            <div className="text-gray-400 text-sm">Storage</div>
                            <div className="text-white text-2xl font-bold mt-1">Agnostic</div>
                            <div className="text-cyan-200/70 text-sm mt-2">IPFS, Arweave, S3, custom</div>
                        </GlassCard>

                        <GlassCard className="p-5">
                            <div className="text-gray-400 text-sm">Verification</div>
                            <div className="text-white text-2xl font-bold mt-1">On-chain</div>
                            <div className="text-cyan-200/70 text-sm mt-2">Deterministic timing</div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Layout */}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
                    {/* TOC */}
                    <div className="lg:sticky lg:top-28 h-fit">
                        <GlassCard className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="text-white font-semibold">Contents</div>
                                <span className="text-xs text-gray-400 px-2 py-1 rounded-full bg-white/5 border border-white/10">
                                    {sections.length} sections
                                </span>
                            </div>

                            <div className="mt-4 flex flex-col gap-1">
                                {sections.map((s) => (
                                    <a
                                        key={s.id}
                                        href={`#${s.id}`}
                                        className="px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition flex items-center justify-between text-sm"
                                    >
                                        <span>{s.title}</span>
                                        <span className="text-cyan-300/70">↳</span>
                                    </a>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-6">
                        <Section id="abstract" title="Abstract">
                            <p>
                                TimeLockContent is a protocol for trust-minimized, time-locked content releases on EVM-compatible blockchains. It addresses the fundamental problem of scheduled content disclosure in environments where centralized infrastructure cannot be trusted to honor release commitments.
                            </p>
                            <p>
                                The protocol combines off-chain symmetric encryption with on-chain cryptographic commitments and time-based reveal mechanisms. Content creators encrypt their data locally, publish a commitment to the encryption key on-chain alongside a release timestamp, and reveal the key after the specified time has elapsed. Buyers can verify the integrity of released content by validating the revealed key against the on-chain commitment.
                            </p>
                            <p>
                                This design achieves deterministic, verifiable release timing without requiring trusted intermediaries to store or manage confidential data, while maintaining a minimal on-chain data footprint and supporting arbitrary off-chain storage providers.
                            </p>
                        </Section>

                        <Section id="introduction" title="1. Introduction">
                            <p>
                                The problem of trust in time-based content release arises in scenarios where a party wishes to commit to publishing specific content at a future time, but cannot rely on centralized infrastructure to enforce this commitment. Examples include coordinated vulnerability disclosures, embargo-protected research publications, time-locked media releases, and trustless escrow arrangements.
                            </p>
                            <p>
                                Traditional scheduled release systems rely on centralized servers that can be taken offline, compromised, censored, or coerced. The operator has privileged access to both the content and the release mechanism, creating a single point of failure and a trust bottleneck.
                            </p>
                            <p>
                                Smart contracts offer deterministic execution and tamper-resistant state, but cannot directly store confidential data. Public blockchains are observable by all participants, making them unsuitable for storing encrypted content that must remain confidential until a future time. Furthermore, on-chain storage costs make it economically infeasible to store large files directly.
                            </p>
                            <p>
                                TimeLockContent addresses these constraints by separating concerns: encryption and storage occur off-chain, while timing enforcement and integrity verification occur on-chain. This hybrid approach combines the confidentiality guarantees of client-side encryption with the trust minimization and verifiability of smart contracts.
                            </p>
                        </Section>

                        <Section id="design-goals" title="2. Design Goals">
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-2">Primary Goals</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><strong>Trust minimization:</strong> No single party should have unilateral control over content release timing or integrity verification.</li>
                                    <li><strong>Storage agnosticism:</strong> The protocol must not depend on any specific storage provider or backend infrastructure.</li>
                                    <li><strong>Chain agnosticism:</strong> The system should be deployable on any EVM-compatible blockchain without modification.</li>
                                    <li><strong>Deterministic release timing:</strong> Release conditions must be verifiable and enforceable through smart contract logic.</li>
                                    <li><strong>Refund safety:</strong> Buyers of paid content must be able to claim refunds if sellers fail to reveal keys.</li>
                                    <li><strong>Minimal on-chain footprint:</strong> Only commitments and metadata should be stored on-chain, not content itself.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg mb-2">Explicit Non-Goals</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><strong>Confidentiality after release:</strong> Once the key is revealed, content becomes public. The protocol does not provide DRM or access control beyond the initial time lock.</li>
                                    <li><strong>Key secrecy after reveal:</strong> The encryption key must be published on-chain for verification. Post-reveal confidentiality is impossible.</li>
                                    <li><strong>Content hosting or distribution:</strong> The protocol does not provide storage infrastructure or guarantee content availability. This responsibility lies with the storage provider chosen by the seller.</li>
                                </ul>
                            </div>
                        </Section>

                        <Section id="system-overview" title="3. System Overview">
                            <p>
                                The TimeLockContent system consists of four primary components, each with clearly defined responsibilities:
                            </p>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Smart Contract Layer</h3>
                                <p>
                                    The TimeLockContent smart contract manages listing state, enforces time-based release conditions, handles payment escrow, validates key reveals, and enables refund claims. It stores only metadata and cryptographic commitments, never the encrypted content itself.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">SDK Layer</h3>
                                <p>
                                    The viem-based SDK provides a type-safe abstraction over the smart contract, handling read operations, write transaction construction, event parsing, and error decoding. It is storage-agnostic and network-agnostic, delegating these concerns to the application layer.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">React Integration Layer</h3>
                                <p>
                                    React hooks built on wagmi provide state management, transaction lifecycle handling, and UI integration. This layer bridges the SDK with frontend applications, managing wallet connections and user interactions.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Off-Chain Storage Providers</h3>
                                <p>
                                    Encrypted content can be stored on IPFS, Arweave, S3-compatible object storage, or custom backends. The protocol is indifferent to storage implementation; only the URI to the ciphertext is recorded on-chain.
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
                                <p className="text-sm text-gray-400">
                                    <strong className="text-white">Separation of Concerns:</strong> The smart contract enforces commitments and timing. The SDK abstracts contract interaction. The application layer handles encryption, storage, and user experience. This modular design enables composability and flexibility while maintaining security guarantees.
                                </p>
                            </div>
                        </Section>

                        <Section id="cryptographic-model" title="4. Cryptographic Model">
                            <p>
                                The protocol employs symmetric encryption for content confidentiality and cryptographic commitments for key binding. The cryptographic model is designed to prevent preimage attacks while enabling efficient on-chain verification.
                            </p>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Symmetric Encryption</h3>
                                <p>
                                    Content is encrypted client-side using AES-256-GCM or XChaCha20-Poly1305. The encryption key is generated using a cryptographically secure random number generator. Symmetric encryption is chosen for efficiency; asymmetric encryption would be prohibitively expensive for large files and unnecessary given the key will eventually be published.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Commitment Scheme</h3>
                                <p>
                                    To prevent the seller from substituting a different key after listing creation, the protocol uses a commitment scheme. The commitment is computed as:
                                </p>
                                <div className="bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-sm">
                                    commitment = keccak256(key || salt)
                                </div>
                                <p>
                                    Where <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">||</code> denotes concatenation. The salt prevents rainbow table attacks and ensures that identical keys for different listings produce different commitments.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Security Properties</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><strong>Preimage resistance:</strong> Given a commitment, it is computationally infeasible to derive the key without knowledge of the salt.</li>
                                    <li><strong>Binding:</strong> The seller cannot produce a different key that hashes to the same commitment.</li>
                                    <li><strong>Hiding:</strong> The commitment reveals no information about the key prior to reveal.</li>
                                </ul>
                                <p className="mt-3">
                                    Keccak256 is sufficient for this application because the key space is large (256 bits of entropy) and the salt adds an additional layer of protection against offline attacks. The commitment can be safely published on-chain without leaking information about the key.
                                </p>
                            </div>
                        </Section>

                        <Section id="timelock-encryption" title="4.5 Timelock Encryption via Drand">
                            <p>
                                In addition to the standard commit-reveal mechanism, the protocol supports an optional timelock encryption mode using the drand randomness beacon. This enables trustless, automatic key revelation without requiring seller participation.
                            </p>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Drand Randomness Beacon</h3>
                                <p>
                                    Drand is a distributed randomness beacon operated by a decentralized network of nodes (League of Entropy). It produces verifiable random values at regular intervals (every 3 seconds on the quicknet network). Each "round" has a predictable timestamp but unpredictable randomness until that round is published.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Timelock Encryption Mechanism</h3>
                                <p>
                                    When creating a listing in whistleblower mode, the seller:
                                </p>
                                <ol className="list-decimal list-inside space-y-2 mt-2">
                                    <li>Calculates the drand round number corresponding to the desired release time</li>
                                    <li>Encrypts the content encryption key using a deterministic derivation from that future round number</li>
                                    <li>Stores the encrypted key on-chain (in <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">timelockEncryptedKey</code>)</li>
                                </ol>
                                <p className="mt-3">
                                    After the release time, when drand publishes the randomness for that round, anyone can:
                                </p>
                                <ol className="list-decimal list-inside space-y-2 mt-2">
                                    <li>Retrieve the round's randomness from drand</li>
                                    <li>Derive the decryption key using the same deterministic process</li>
                                    <li>Decrypt the content encryption key</li>
                                    <li>Download and decrypt the content</li>
                                </ol>
                                <p className="mt-3 bg-white/5 border border-white/10 rounded-lg p-4 text-sm">
                                    <strong className="text-white">Important:</strong> This demo implementation uses simple XOR-based encryption for proof of concept. Production systems should use proper Identity-Based Encryption (IBE) schemes like tlock-js which provide cryptographic guarantees against adaptive chosen-ciphertext attacks.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Advantages Over Standard Commit-Reveal</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><strong>No seller participation required:</strong> The key becomes automatically decryptable at the release time, regardless of seller actions.</li>
                                    <li><strong>Unstoppable disclosure:</strong> Once committed, the timelock cannot be revoked or censored. The seller cannot prevent key revelation.</li>
                                    <li><strong>Trustless operation:</strong> No reliance on the seller's honesty or availability after listing creation.</li>
                                    <li><strong>Dead man's switch:</strong> Ideal for whistleblowing or scenarios where the seller may become unavailable.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Tradeoffs</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><strong>Cannot be revoked:</strong> Unlike standard listings where sellers can choose not to reveal, timelock encryption ensures automatic release.</li>
                                    <li><strong>External dependency:</strong> Relies on drand network availability (mitigated by network's high redundancy - 15+ independent nodes).</li>
                                    <li><strong>Timing precision:</strong> Limited to drand's round granularity (3 seconds on quicknet).</li>
                                </ul>
                            </div>
                        </Section>

                        <Section id="commit-reveal" title="5. Commit–Reveal Mechanism">
                            <p>
                                The protocol supports two distinct modes for time-locked content release: standard commit-reveal requiring seller participation, and whistleblower mode using timelock encryption for trustless automatic release.
                            </p>

                            <div>
                                <h3 className="text-white font-semibold mb-2">Mode 1: Standard Commit-Reveal</h3>
                                <p>
                                    In standard mode, the seller creates a cryptographic commitment and manually reveals the key after the release time.
                                </p>

                                <h4 className="text-white font-medium mt-3 mb-2">Phase 1: Listing Creation</h4>
                                <p>The seller calls <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">createListing</code> with:</p>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                    <li>keyCommitment: keccak256(key || salt)</li>
                                    <li>releaseTime: Unix timestamp</li>
                                    <li>isTimelockEnabled: false</li>
                                </ul>

                                <h4 className="text-white font-medium mt-3 mb-2">Phase 2: Manual Key Reveal</h4>
                                <p>
                                    After releaseTime, the seller calls <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">revealKey(listingId, key, salt)</code>.
                                    The contract verifies the commitment and stores the key on-chain.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold mb-2">Mode 2: Whistleblower (Timelock) Mode</h3>
                                <p>
                                    In whistleblower mode, the key is automatically decryptable at release time without seller action.
                                </p>

                                <h4 className="text-white font-medium mt-3 mb-2">Phase 1: Listing Creation</h4>
                                <p>The seller calls <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">createListing</code> with:</p>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                    <li>timelockEncryptedKey: Encryption key encrypted with future drand round</li>
                                    <li>drandRound: The drand round number corresponding to releaseTime</li>
                                    <li>isTimelockEnabled: true</li>
                                    <li>keyCommitment: Zero bytes (not needed)</li>
                                </ul>

                                <h4 className="text-white font-medium mt-3 mb-2">Phase 2: Automatic Decryption</h4>
                                <p>
                                    After releaseTime, anyone can:
                                </p>
                                <ol className="list-decimal list-inside space-y-1 mt-2">
                                    <li>Query drand for the round's randomness</li>
                                    <li>Derive the decryption key deterministically</li>
                                    <li>Decrypt timelockEncryptedKey to obtain the content key</li>
                                    <li>Download and decrypt the content</li>
                                </ol>
                                <p className="mt-3 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm">
                                    <strong className="text-purple-300">No blockchain transaction required</strong> for key retrieval in whistleblower mode.
                                    This eliminates gas costs and seller dependency for content access.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold mb-2">Mode Comparison</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm mt-2">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left py-2 px-3 text-white">Property</th>
                                                <th className="text-left py-2 px-3 text-white">Standard Mode</th>
                                                <th className="text-left py-2 px-3 text-white">Whistleblower Mode</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300">
                                            <tr className="border-b border-white/10">
                                                <td className="py-2 px-3">Seller action required</td>
                                                <td className="py-2 px-3">✅ Yes (manual reveal)</td>
                                                <td className="py-2 px-3">❌ No (automatic)</td>
                                            </tr>
                                            <tr className="border-b border-white/10">
                                                <td className="py-2 px-3">Can be revoked</td>
                                                <td className="py-2 px-3">✅ Yes (seller can refuse)</td>
                                                <td className="py-2 px-3">❌ No (unstoppable)</td>
                                            </tr>
                                            <tr className="border-b border-white/10">
                                                <td className="py-2 px-3">External dependencies</td>
                                                <td className="py-2 px-3">❌ None</td>
                                                <td className="py-2 px-3">✅ Drand network</td>
                                            </tr>
                                            <tr className="border-b border-white/10">
                                                <td className="py-2 px-3">Paid listings supported</td>
                                                <td className="py-2 px-3">✅ Yes</td>
                                                <td className="py-2 px-3">⚠️ Typically free</td>
                                            </tr>
                                            <tr className="border-b border-white/10">
                                                <td className="py-2 px-3">Refund mechanism</td>
                                                <td className="py-2 px-3">✅ Via deposit</td>
                                                <td className="py-2 px-3">❌ Not needed</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Section>
                        <Section id="economic-model" title="6. Economic Model">
                            <p>
                                The protocol supports both public (free) and paid listings, with different economic models for standard and whistleblower modes.
                            </p>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Standard Mode Economics</h3>
                                <p>
                                    Standard mode supports paid listings with seller deposits and buyer refunds...
                                    [existing content]
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Whistleblower Mode Economics</h3>
                                <p>
                                    Whistleblower mode is designed for free, public information disclosure.
                                    Key characteristics:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><strong>Typically free:</strong> Price is usually 0 since key becomes public automatically</li>
                                    <li><strong>No deposit needed:</strong> Seller cannot fail to reveal, so refund mechanism is unnecessary</li>
                                    <li><strong>No seller payout:</strong> Content becomes public domain once released</li>
                                </ul>
                                <p className="mt-3 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm">
                                    <strong className="text-purple-300">Note:</strong> While paid whistleblower listings are technically possible,
                                    they defeat the purpose since anyone can decrypt after release time without payment.
                                </p>
                            </div>
                        </Section>
                        <Section id="smart-contract" title="7. Smart Contract Specification">
                            <div>
                                <h3 className="text-white font-semibold mb-2">Core Data Structure</h3>
                                <div className="bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-sm space-y-1">
                                    <div>struct Listing &#123;</div>
                                    <div className="pl-4">address seller;</div>
                                    <div className="pl-4">uint96 price;</div>
                                    <div className="pl-4">uint64 releaseTime;</div>
                                    <div className="pl-4">uint64 revealDeadline;</div>
                                    <div className="pl-4">string cipherUri;</div>
                                    <div className="pl-4">bytes32 cipherHash;</div>
                                    <div className="pl-4">bytes32 keyCommitment;</div>
                                    <div className="pl-4">bool keyRevealed;</div>
                                    <div className="pl-4">bytes revealedKey;</div>
                                    <div className="pl-4">uint256 deposit;</div>
                                    <div className="pl-4 text-purple-300">// 🔥 Timelock fields</div>
                                    <div className="pl-4 text-purple-300">bool isTimelockEnabled;</div>
                                    <div className="pl-4 text-purple-300">uint64 drandRound;</div>
                                    <div className="pl-4 text-purple-300">bytes timelockEncryptedKey;</div>
                                    <div>&#125;</div>
                                </div>
                                <p className="mt-3 text-sm text-gray-400">
                                    The three new fields enable optional timelock encryption mode. When <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">isTimelockEnabled</code> is true,
                                    the keyCommitment is ignored and timelockEncryptedKey contains the drand-encrypted content key.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">State Transitions</h3>
                                <p>A listing progresses through the following states:</p>
                                <ol className="list-decimal list-inside space-y-2 mt-2">
                                    <li><strong>Created:</strong> Listing exists, release time not reached, key not revealed.</li>
                                    <li><strong>Unlocked:</strong> <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">block.timestamp ≥ releaseTime</code>, key not yet revealed.</li>
                                    <li><strong>Revealed:</strong> Key has been successfully revealed and verified.</li>
                                    <li><strong>Refundable:</strong> Grace period expired without reveal, buyers can claim refunds.</li>
                                </ol>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Core Functions</h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-white font-mono text-sm">createListing(...)</div>
                                        <p className="text-sm mt-1">Creates a new listing. Validates that sellerDeposit is sufficient, stores listing data, transfers deposit from seller.</p>
                                    </div>
                                    <div>
                                        <div className="text-white font-mono text-sm">buy(uint256 listingId)</div>
                                        <p className="text-sm mt-1">Allows a buyer to purchase access. Validates payment amount, increments buyerCount, transfers payment to seller immediately.</p>
                                    </div>
                                    <div>
                                        <div className="text-white font-mono text-sm">revealKey(uint256 listingId, bytes32 key, bytes32 salt)</div>
                                        <p className="text-sm mt-1">Reveals the encryption key. Validates releaseTime has passed, verifies commitment, stores key and salt, marks listing as revealed.</p>
                                    </div>
                                    <div>
                                        <div className="text-white font-mono text-sm">claimRefund(uint256 listingId)</div>
                                        <p className="text-sm mt-1">Allows buyers to claim refunds if seller failed to reveal. Validates grace period has expired, transfers refund from seller deposit.</p>
                                    </div>
                                    <div>
                                        <div className="text-white font-mono text-sm">getListing(uint256 listingId)</div>
                                        <p className="text-sm mt-1">Read-only function returning listing data.</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Events and Errors</h3>
                                <p>
                                    The contract emits events for all state changes (<code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">ListingCreated</code>, <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">ListingPurchased</code>, <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">KeyRevealed</code>, <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">RefundClaimed</code>) and uses custom errors for gas-efficient revert conditions.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Invariants</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>A listing can only be revealed once.</li>
                                    <li>Reveals can only occur after releaseTime.</li>
                                    <li>Refunds can only be claimed if the listing is not revealed and the grace period has expired.</li>
                                    <li>The revealed key must satisfy the commitment check.</li>
                                </ul>
                            </div>
                        </Section>

                        <Section id="sdk" title="8. SDK Abstraction Layer">
                            <p>
                                The SDK provides a typed abstraction over the TimeLockContent smart contract, handling the complexity of blockchain interaction while remaining agnostic to network configuration and storage implementation.
                            </p>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Read vs Write Separation</h3>
                                <p>
                                    Read operations use viem's public client and do not require wallet signatures. Write operations construct transaction requests that are passed to wagmi hooks for wallet interaction and transaction submission. This separation enables efficient querying while maintaining security for state-changing operations.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Event Parsing</h3>
                                <p>
                                    The SDK includes utilities for parsing contract events, enabling applications to efficiently index historical data and react to state changes. Event filters can be applied by listing ID, seller address, or time range.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Error Decoding</h3>
                                <p>
                                    Custom errors from the smart contract are decoded into structured error objects, providing applications with actionable information about transaction failures. This is particularly important for user experience, as it enables specific error messages rather than generic "transaction reverted" failures.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Chain Address Resolution</h3>
                                <p>
                                    The SDK includes a mapping of chain IDs to deployed contract addresses, but delegates network configuration to viem and wagmi. Applications specify which chain to use through their wagmi configuration; the SDK simply looks up the appropriate contract address for that chain.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Storage Agnosticism</h3>
                                <p>
                                    The SDK does not prescribe a storage solution. Applications are responsible for encrypting content, uploading to their chosen storage provider, and passing the resulting URI to the SDK. This design keeps the SDK lightweight and allows applications to choose storage solutions appropriate to their use case.
                                </p>
                            </div>
                        </Section>

                        <Section id="storage" title="9. Storage Model">
                            <p>
                                The protocol treats encrypted content storage as an orthogonal concern, delegating it entirely to the application layer. This design decision has significant implications for security, cost, and flexibility.
                            </p>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Off-Chain Storage Rationale</h3>
                                <p>
                                    Storing encrypted content on-chain would be prohibitively expensive for most use cases. A 10MB file would cost thousands of dollars in gas fees on Ethereum mainnet. Off-chain storage reduces costs by several orders of magnitude while maintaining security guarantees through the commitment mechanism.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Storage Provider Options</h3>
                                <div className="space-y-2">
                                    <div>
                                        <strong className="text-white">IPFS:</strong> Content-addressed, decentralized, with incentive layer (Filecoin). Well-suited for permanent storage and high availability.
                                    </div>
                                    <div>
                                        <strong className="text-white">Arweave:</strong> Permanent storage with one-time payment. Ideal for archival use cases.
                                    </div>
                                    <div>
                                        <strong className="text-white">S3-compatible:</strong> Traditional cloud storage. Low cost, high performance, requires trust in provider.
                                    </div>
                                    <div>
                                        <strong className="text-white">Custom backends:</strong> Self-hosted or specialized storage. Maximum control, variable reliability.
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Role of cipherUri</h3>
                                <p>
                                    The <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">cipherUri</code> field in a listing is an arbitrary string pointer to the encrypted content. It could be an IPFS CID, an Arweave transaction ID, an HTTP URL, or any other addressing scheme. The protocol does not interpret this field; it simply stores it for reference.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Trust Assumptions</h3>
                                <p>
                                    The choice of storage provider introduces trust assumptions:
                                </p>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                    <li>Centralized storage: Provider must not delete files before release time.</li>
                                    <li>Decentralized storage: Content must be pinned by sufficient nodes.</li>
                                    <li>Both: Storage layer must remain accessible to buyers after key reveal.</li>
                                </ul>
                                <p className="mt-3">
                                    These assumptions are separate from the protocol's security guarantees. The protocol ensures that the revealed key corresponds to the committed value; it cannot guarantee that the ciphertext remains available.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Public Ciphertext Property</h3>
                                <p>
                                    The encrypted content can be stored publicly without compromising confidentiality, because the encryption key is not yet known. Anyone can download the ciphertext, but without the key, it is computationally infeasible to decrypt. This property enables use of public storage networks without additional access control.
                                </p>
                            </div>
                        </Section>

                        <Section id="security" title="10. Security Analysis">
                            <div>
                                <h3 className="text-white font-semibold mb-2">Preimage Resistance of Commitments</h3>
                                <p>
                                    The security of the commit phase relies on the preimage resistance of keccak256. Given a commitment value, an attacker cannot derive the encryption key without either brute-forcing the key space (infeasible for 256-bit keys) or performing a preimage attack on keccak256 (no known practical attack exists).
                                </p>
                                <p className="mt-2">
                                    The salt prevents rainbow table attacks and ensures that commitments for identical keys differ across listings. Even if an attacker observes a key reveal for one listing, they cannot use this information to attack other listings with the same key.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Drand Network Dependency</h3>
                                <p>
                                    Whistleblower mode introduces a dependency on the drand randomness beacon.
                                    Security considerations:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><strong>Network availability:</strong> Drand must remain operational for auto-decryption to work. Mitigated by 15+ independent nodes globally.</li>
                                    <li><strong>Predictable timing:</strong> Round numbers are deterministic, so release timing is transparent to all parties.</li>
                                    <li><strong>No censorship vector:</strong> Even if drand goes offline temporarily, historical randomness remains available through multiple archives.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Early Key Leakage Risks</h3>
                                <p>
                                    The protocol cannot prevent the seller from voluntarily leaking the key before the release time. If the seller publishes the key through a side channel, buyers can decrypt the content early. This is a fundamental limitation of any system where the seller knows the key.
                                </p>
                                <p className="mt-2">
                                    Mitigation strategies exist but are outside the protocol's scope: reputation systems, legal contracts, or threshold secret sharing schemes where no single party knows the complete key until release time.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Seller Griefing Scenarios</h3>
                                <p>
                                    A malicious seller could create a listing, collect payments from buyers, and never reveal the key. The protocol mitigates this through the deposit mechanism: if the seller deposits sufficient collateral, buyers can claim refunds.
                                </p>
                                <p className="mt-2">
                                    However, if the seller does not deposit, or deposits an amount less than total payments collected, some buyers may not receive refunds. Applications should warn users about listings with insufficient deposits.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Buyer Refund Guarantees</h3>
                                <p>
                                    Refunds are guaranteed only if:
                                </p>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                    <li>The seller deposited sufficient collateral</li>
                                    <li>The grace period has expired without reveal</li>
                                    <li>The buyer has not already claimed a refund</li>
                                </ul>
                                <p className="mt-2">
                                    The contract enforces these conditions automatically. However, if the seller's deposit is depleted, later buyers may not receive full refunds. This creates a race condition that applications should surface to users.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Reentrancy Considerations</h3>
                                <p>
                                    All state-changing functions follow the checks-effects-interactions pattern to prevent reentrancy attacks. External calls (transfers) occur only after all state updates are finalized. The contract does not use low-level calls or delegate to untrusted contracts.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Blockchain Time Guarantees</h3>
                                <p>
                                    Release timing relies on <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">block.timestamp</code>, which can be manipulated by miners within a narrow range (typically ±15 seconds on Ethereum). For most use cases, this variance is acceptable. Applications requiring precise timing should account for potential block timestamp drift.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Limitations</h3>
                                <p>The protocol does not protect against:</p>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                    <li>Voluntary key leakage by the seller before release time</li>
                                    <li>Storage provider deletion of encrypted content</li>
                                    <li>Side-channel attacks on encryption implementation</li>
                                    <li>Social engineering or coercion of the seller</li>
                                    <li>Regulatory or legal pressure to disclose keys early</li>
                                </ul>
                            </div>
                        </Section>

                        <Section id="limitations" title="11. Limitations and Tradeoffs">
                            <div>
                                <h3 className="text-white font-semibold mb-2">Public Key Reveal</h3>
                                <p>
                                    Once the key is revealed on-chain, it becomes permanently public. Anyone can decrypt the content, regardless of whether they paid for access. This is an inherent property of blockchain-based systems and cannot be avoided without introducing trusted third parties or complex cryptographic schemes.
                                </p>
                                <p className="mt-2">
                                    Applications targeting scenarios where post-reveal access control is critical should consider hybrid approaches, such as revealing a second-layer decryption key only to verified buyers.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">No DRM Guarantees</h3>
                                <p>
                                    The protocol provides time-locked confidentiality, not digital rights management. After the key is revealed, preventing redistribution of decrypted content is impossible at the protocol level. This is a feature, not a bug: DRM systems require trusted hardware or legal enforcement, which contradict the trust-minimization goals.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Dependence on Block Timestamps</h3>
                                <p>
                                    Release timing is enforced by <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">block.timestamp</code>, which is set by block producers and can vary slightly from real-world time. For applications requiring millisecond precision, this limitation may be significant. For most use cases (embargoes measured in hours or days), timestamp variance is negligible.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Inability to Force Seller Participation</h3>
                                <p>
                                    The protocol cannot compel a seller to reveal the key. If a seller chooses not to participate after the release time, the only recourse is the refund mechanism (if a deposit was provided). This is a fundamental limitation of permissionless systems: participation cannot be mandated, only incentivized.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Storage Availability Assumptions</h3>
                                <p>
                                    The protocol assumes that encrypted content remains available for download after the key is revealed. If the storage provider deletes files or becomes unavailable, buyers cannot decrypt the content even with a valid key. This risk can be mitigated by using decentralized storage with redundancy, but cannot be eliminated entirely.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Transaction Costs</h3>
                                <p>
                                    All on-chain operations incur gas fees. On high-fee networks, these costs may be significant relative to content value. The protocol is designed to minimize gas usage (only metadata stored on-chain), but cannot eliminate costs entirely. Deployment on layer-2 networks or low-fee chains can mitigate this limitation.
                                </p>
                            </div>
                        </Section>

                        <Section id="use-cases" title="12. Use Cases">
                            <div>
                                <h3 className="text-white font-semibold mb-2">Coordinated Vulnerability Disclosures</h3>
                                <p>
                                    Security researchers can commit to a vulnerability disclosure at a specific time, giving affected parties advance notice to patch without revealing exploit details early. The on-chain commitment proves the researcher knew of the vulnerability before disclosure, while the time lock ensures responsible disclosure timing.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Embargoed Research Publications</h3>
                                <p>
                                    Academic or industry researchers can commit to research findings before publication, establishing priority and preventing premature leaks. The commitment proves existence of results at a specific time, while encryption preserves confidentiality until the embargo lifts.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Time-Locked Media Releases</h3>
                                <p>
                                    Content creators can release music, videos, or written work at predetermined times without relying on centralized platforms. Fans can purchase access in advance, with cryptographic guarantee of release timing. This enables trust-minimized crowdfunding for content releases.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Delayed DAO Announcements</h3>
                                <p>
                                    Decentralized organizations can commit to governance proposals or strategic plans before execution, preventing front-running while enabling transparent decision-making. The time lock ensures that stakeholders have advance notice without enabling exploit of early information.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Trustless Escrow for Information</h3>
                                <p>
                                    Buyers can pay for information that will be released at a future time, with cryptographic proof that the seller committed to specific content. If the seller fails to reveal, buyers can claim refunds. This enables markets for time-sensitive information without trusted intermediaries.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Whistleblower Protection (Timelock Mode)</h3>
                                <p>
                                    Whistleblowers can use timelock encryption to create unstoppable, automatic disclosures.
                                    Unlike standard mode, the seller cannot be coerced or prevented from releasing information:
                                </p>
                                <ul className="list-disc list-inside space-y-2 mt-2">
                                    <li><strong>Dead man's switch:</strong> Information releases even if the whistleblower becomes unavailable</li>
                                    <li><strong>Credible commitment:</strong> Once committed, the disclosure cannot be revoked under any circumstances</li>
                                    <li><strong>No ongoing participation:</strong> Whistleblower can "set and forget" the release</li>
                                    <li><strong>Censorship resistance:</strong> Neither government pressure nor corporate influence can prevent release</li>
                                </ul>
                                <p className="mt-3">
                                    This makes timelock mode particularly valuable for high-stakes disclosures where
                                    the whistleblower may face retaliation or be unable to perform the manual reveal.
                                </p>
                            </div>
                        </Section>

                        <Section id="future-work" title="13. Future Work">
                            <div>
                                <h3 className="text-white font-semibold mb-2">Streaming or Multi-Stage Reveals</h3>
                                <p>
                                    The current protocol reveals the entire decryption key at once. Future iterations could support progressive revelation, where content is decrypted in stages over time. This would enable serialized content releases or gradual information disclosure scenarios.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Zero-Knowledge Delayed Decryption</h3>
                                <p>
                                    Advanced cryptographic schemes like time-lock puzzles or witness encryption could enable automatic key revelation without seller participation. This would eliminate the trust assumption that sellers will reveal keys, though at the cost of increased complexity and computational requirements.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Threshold Secret Sharing</h3>
                                <p>
                                    Distributing key shares across multiple parties using Shamir secret sharing or threshold encryption would prevent any single party from leaking the key early. At release time, a threshold of parties would reveal their shares, reconstructing the key. This adds robustness but requires coordination mechanisms.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Integration with Decentralized Storage Incentives</h3>
                                <p>
                                    Tighter integration with storage networks like Filecoin could enable automatic verification of content availability and renewal of storage deals. This would reduce the risk of storage provider failures affecting content accessibility.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Cross-Chain Commitment Verification</h3>
                                <p>
                                    Using cross-chain messaging protocols, commitments made on one chain could be verified on another. This would enable use cases where content release timing is enforced on a low-fee chain while verification occurs on a high-security chain.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Governance and Protocol Evolution</h3>
                                <p>
                                    As the protocol matures, governance mechanisms could enable community-driven parameter adjustments, such as grace periods for refunds or fee structures. This would allow the protocol to adapt to changing needs while maintaining decentralization.
                                </p>
                            </div>
                        </Section>

                        <Section id="conclusion" title="14. Conclusion">
                            <p>
                                TimeLockContent demonstrates that trust-minimized, time-locked content releases can be achieved through careful separation of concerns: off-chain encryption for confidentiality, on-chain commitments for integrity, and smart contract logic for deterministic timing enforcement.
                            </p>
                            <p>
                                The protocol's intentionally minimal design prioritizes verifiability and composability over feature richness. By storing only commitments and metadata on-chain, it achieves low costs while maintaining strong security guarantees. By delegating storage and network configuration to the application layer, it remains flexible and adaptable to diverse use cases.
                            </p>
                            <p>
                                The core contribution of TimeLockContent is not novel cryptography or consensus mechanisms, but rather a pragmatic combination of existing primitives that addresses a real problem: how to commit to future content releases without trusting centralized infrastructure. This is achieved through symmetric encryption, cryptographic commitments, and time-based smart contract logic.
                            </p>
                            <p>
                                The protocol's limitations are acknowledged and intentional. Public key revelation after release time is not a flaw but a fundamental property of trustless systems. The inability to force seller participation is mitigated by economic incentives, not technical enforcement. Storage availability is delegated to specialized providers rather than addressed at the protocol level.
                            </p>
                            <p>
                                Future extensions can build on this foundation to address more complex scenarios, but the base protocol remains deliberately simple and focused. This simplicity is a feature: it reduces attack surface, minimizes gas costs, and ensures the system can be formally verified and audited.
                            </p>
                            <p>
                                TimeLockContent is designed as a composable primitive for trust-minimized time-locked content systems, not as a complete solution for all content distribution scenarios. Its value lies in providing a minimal, secure foundation upon which more complex systems can be built.
                            </p>
                        </Section>

                        {/* CTA */}
                        <GlassCard className="p-7 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                                <div>
                                    <div className="text-white text-2xl font-bold">Explore the Protocol</div>
                                    <div className="text-gray-400 mt-1">
                                        Try the implementation or review the smart contract code.
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.99 }}>
                                        <Link
                                            href="/playground"
                                            className="border border-gray-600 text-white px-5 py-2.5 rounded-full font-semibold hover:border-white transition inline-flex"
                                        >
                                            Open Playground
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: "0 0 40px rgba(6, 182, 212, 0.35)",
                                        }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Link
                                            href="/create"
                                            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-2.5 rounded-full font-semibold border border-white/10 inline-flex"
                                        >
                                            Create Lock
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </GlassCard>

                        <div className="text-center text-xs text-gray-600 pt-2">
                            © {new Date().getFullYear()} TimeLockContent Protocol — Technical Specification v1.0
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}