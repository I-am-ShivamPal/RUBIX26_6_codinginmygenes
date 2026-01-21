'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle, Activity, ShieldCheck, RefreshCw, Clock } from 'lucide-react';
import { authApi } from '@/lib/auth';
import clsx from 'clsx';

// Types matching our API response
interface DashboardStats {
    totalSessions: number;
    activeSessions: number;
    highRiskSessions: number;
    totalViolations: number;
}

interface SessionData {
    _id: string;
    session_id: string;
    user_id?: string;
    cum_risk_score: number;
    last_active: string;
    start_time: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Mounted state for hydration fix
    const [mounted, setMounted] = useState(false);

    const fetchData = async () => {
        try {
            const [statsRes, sessionsRes] = await Promise.all([
                authApi.get('/admin/stats'),
                authApi.get('/admin/sessions')
            ]);
            setStats(statsRes.data);
            setSessions(sessionsRes.data.sessions);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Values fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // Poll every 5 seconds
    useEffect(() => {
        setMounted(true);
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const statCards = [
        {
            label: 'Active Sessions',
            value: stats?.activeSessions || 0,
            icon: Activity,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            label: 'High Risk',
            value: stats?.highRiskSessions || 0,
            icon: AlertTriangle,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        {
            label: 'Total Students',
            value: stats?.totalSessions || 0,
            icon: Users,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        {
            label: 'Total Violations',
            value: stats?.totalViolations || 0,
            icon: ShieldCheck,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
                    <p className="text-gray-400 mt-1">Real-time monitoring of proctoring sessions</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
                    <Clock className="w-4 h-4" />
                    <span>Updated: {mounted ? lastUpdated.toLocaleTimeString() : 'Loading...'}</span>
                    <RefreshCw className={clsx("w-4 h-4 ml-2", loading && "animate-spin")} />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={clsx(
                                "p-6 rounded-2xl border backdrop-blur-sm",
                                "bg-gray-900/50 hover:bg-gray-900/80 transition-colors",
                                stat.border
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                                </div>
                                <div className={clsx("p-3 rounded-xl", stat.bg, stat.color)}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Live Sessions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Live Monitoring</h3>
                    <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                        Live Feed
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-gray-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Session ID</th>
                                <th className="px-6 py-4">Risk Score</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            <AnimatePresence>
                                {sessions.map((session) => {
                                    const isCritical = session.cum_risk_score > 50;
                                    const isWarning = session.cum_risk_score > 20;

                                    return (
                                        <motion.tr
                                            key={session.session_id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="group hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-mono text-sm text-gray-300">
                                                {session.session_id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={clsx("h-full rounded-full transition-all duration-500",
                                                                isCritical ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-green-500"
                                                            )}
                                                            style={{ width: `${Math.min(session.cum_risk_score, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className={clsx("text-sm font-bold",
                                                        isCritical ? "text-red-400" : isWarning ? "text-yellow-400" : "text-green-400"
                                                    )}>
                                                        {session.cum_risk_score.toFixed(1)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isCritical ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                        <AlertTriangle className="w-3 h-3" /> Critical
                                                    </span>
                                                ) : isWarning ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                        <AlertTriangle className="w-3 h-3" /> Warning
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                        <ShieldCheck className="w-3 h-3" /> Safe
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(session.last_active).toLocaleTimeString()}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>

                            {sessions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No active sessions found via API polling.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
