'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { authApi } from '@/lib/auth';
import clsx from 'clsx';

interface SessionData {
    _id: string;
    session_id: string;
    user_id?: string;
    cum_risk_score: number;
    last_active: string;
    start_time: string;
}

export default function SessionsPage() {
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                // Reusing the sessions endpoint, but ideally this would be a specific history endpoint with pagination
                const res = await authApi.get('/admin/sessions');
                setSessions(res.data.sessions);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const filteredSessions = sessions.filter(s =>
        s.session_id.toLowerCase().includes(search.toLowerCase())
    );

    const handleExport = () => {
        if (!sessions.length) return;

        const headers = ["Session ID", "User", "Risk Score", "Start Time", "Last Active"];
        const csvContent = [
            headers.join(","),
            ...sessions.map(s => [
                s.session_id,
                s.user_id || 'Anonymous',
                s.cum_risk_score.toFixed(1),
                s.start_time ? new Date(s.start_time).toISOString() : '-',
                new Date(s.last_active).toISOString()
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `sessions_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Session History</h1>
                    <p className="text-gray-400 mt-1">Archive of all proctoring sessions</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search Session ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors w-64"
                        />
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-gray-400 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Session ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Risk Score</th>
                                <th className="px-6 py-4">Start Time</th>
                                <th className="px-6 py-4">Last Active</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading history...</td></tr>
                            ) : filteredSessions.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No sessions found.</td></tr>
                            ) : (
                                filteredSessions.map((session) => (
                                    <motion.tr
                                        key={session._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-sm text-purple-400">
                                            {session.session_id}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            {session.user_id || 'Anonymous'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2 py-1 rounded text-xs font-bold",
                                                session.cum_risk_score > 50 ? "bg-red-500/20 text-red-400" :
                                                    session.cum_risk_score > 20 ? "bg-yellow-500/20 text-yellow-400" :
                                                        "bg-green-500/20 text-green-400"
                                            )}>
                                                {session.cum_risk_score.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {session.start_time ? new Date(session.start_time).toLocaleString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(session.last_active).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-gray-500 hover:text-white transition-colors text-sm underline">
                                                View Report
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {filteredSessions.length} results</span>
                    <div className="flex gap-2">
                        <button disabled className="p-1 rounded hover:bg-white/5 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                        <button disabled className="p-1 rounded hover:bg-white/5 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
