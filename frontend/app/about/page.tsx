'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Users, Globe, Award, Target, Zap } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar />

            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        About Smart-ProctorAI
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        We are redefining the future of assessments with ethical, AI-driven integrity solutions.
                        Our mission is to create a fair evaluation environment for everyone, everywhere.
                    </p>
                </motion.div>

                {/* Mission & Vision Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
                    >
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                            <Target className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed">
                            To eliminate academic dishonesty through non-intrusive, intelligent monitoring.
                            We believe that maintaining integrity shouldn't come at the cost of student privacy
                            or experience. We build tools that are as respectful as they are robust.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
                    >
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                            <Globe className="w-6 h-6 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Global Vision</h2>
                        <p className="text-gray-400 leading-relaxed">
                            A world where credentials are universally trusted because the assessment process is
                            universally secure. We aim to bridge the gap between remote education and
                            standardized testing, enabling credible certification anywhere in the world.
                        </p>
                    </motion.div>
                </div>

                {/* Core Values Section */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Shield,
                                title: "Uncompromised Security",
                                desc: "Military-grade encryption and state-of-the-art computer vision ensure that every exam session is protected against sophisticated cheating methods."
                            },
                            {
                                icon: Zap,
                                title: "Real-Time Intelligence",
                                desc: "Our AI doesn't just record; it analyzes. Instant feedback and live reporting empower proctors to intervene exactly when needed, not after the fact."
                            },
                            {
                                icon: Users,
                                title: "Student-Centric Design",
                                desc: "We prioritize user experience (UX). Our system is designed to reduce exam anxiety with a clean interface, clear instructions, and privacy-first monitoring."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-white/20 transition-all group"
                            >
                                <item.icon className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors mb-4" />
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Team/Stats Placeholder (Optional but adds credibility) */}
                <div className="text-center py-20 border-t border-white/10">
                    <h2 className="text-3xl font-bold mb-8">Trusted by</h2>
                    <div className="flex flex-wrap justify-center gap-12 text-gray-500 font-bold text-xl opacity-50">
                        <span>MIT</span>
                        <span>STANFORD</span>
                        <span>HARVARD</span>
                        <span>OXFORD</span>
                        <span>CAMBRIDGE</span>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
