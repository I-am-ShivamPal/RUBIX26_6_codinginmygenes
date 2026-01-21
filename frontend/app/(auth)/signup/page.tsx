'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/auth';
import { hashPassword } from '@/lib/security';
import { ArrowRight, Loader2, Lock, Mail, User, Shield, GraduationCap } from 'lucide-react';
import clsx from 'clsx';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { email, password, full_name: fullName, role } = formData;
            const hashedPassword = await hashPassword(password);
            await authApi.post('/signup', {
                email,
                full_name: fullName,
                password: hashedPassword, // Send hashed password
                role
            });
            router.push('/login');
        } catch (err: any) {
            console.error('Signup Request Failed:', err);
            setError(err.response?.data?.detail || `Signup failed: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Create Account
                </h1>
                <p className="text-gray-400 mt-2">Join Smart-ProctorAI to get started</p>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm flex items-center gap-2"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'student' })}
                        className={clsx(
                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                            formData.role === 'student'
                                ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                : "bg-black/20 border-gray-800 text-gray-500 hover:bg-white/5"
                        )}
                    >
                        <GraduationCap className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Student</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'admin' })}
                        className={clsx(
                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                            formData.role === 'admin'
                                ? "bg-purple-500/20 border-purple-500 text-purple-400"
                                : "bg-black/20 border-gray-800 text-gray-500 hover:bg-white/5"
                        )}
                    >
                        <Shield className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Admin</span>
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-pink-400 transition-colors" />
                        <input
                            type="text"
                            required
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full bg-black/40 border border-gray-800 rounded-xl px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-black/40 border border-gray-800 rounded-xl px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                            placeholder="user@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-black/40 border border-gray-800 rounded-xl px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Create Account <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center mt-8 text-gray-400 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                    Sign in
                </Link>
            </p>
        </motion.div>
    );
}
