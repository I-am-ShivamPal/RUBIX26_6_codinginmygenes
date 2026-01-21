'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, CheckCircle, Zap } from 'lucide-react';

export const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8"
                >
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-blue-200">AI-Powered Proctoring 2.0</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                >
                    Secure Exams with <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        Intelligent Integrity
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Smart-ProctorAI ensures exam authenticity through advanced computer vision and behavioral analysis. Trusted by institutions worldwide.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/signup">
                        <button className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-2">
                            Start for Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                    <Link href="/about">
                        <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                            Learn More
                        </button>
                    </Link>
                </motion.div>

                {/* Additional Interactive Detail Section: How It Works */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 text-left space-y-8"
                >
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 backdrop-blur-md">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                            System Architecture
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <div className="h-40 bg-black/40 rounded-xl border border-white/5 p-4 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <p className="text-blue-400 text-xs font-mono mb-1">MODULE_01</p>
                                        <h4 className="text-white font-bold">Biometric Scan</h4>
                                    </div>
                                    <Shield className="absolute top-4 right-4 w-6 h-6 text-white/20 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Advanced facial recognition maps 128 keypoints to verify student identity continuously throughout the session.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="h-40 bg-black/40 rounded-xl border border-white/5 p-4 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <p className="text-purple-400 text-xs font-mono mb-1">MODULE_02</p>
                                        <h4 className="text-white font-bold">Environment Analysis</h4>
                                    </div>
                                    <Zap className="absolute top-4 right-4 w-6 h-6 text-white/20 group-hover:text-purple-400 transition-colors" />
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Real-time object detection identifies unauthorized devices, books, or additional people in the frame.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="h-40 bg-black/40 rounded-xl border border-white/5 p-4 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <p className="text-pink-400 text-xs font-mono mb-1">MODULE_03</p>
                                        <h4 className="text-white font-bold">Behavioral Heuristics</h4>
                                    </div>
                                    <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-white/20 group-hover:text-pink-400 transition-colors" />
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Gaze tracking and head pose estimation detect suspicious focus patterns indicative of cheating.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
