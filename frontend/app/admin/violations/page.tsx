'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, AlertTriangle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { authApi } from '@/lib/auth';
import clsx from 'clsx';

interface ViolationData {
    _id: string;
    session_id: string;
    type: string;
    severity: string;
    details: string;
    timestamp: string;
}

export default function ViolationsPage() {
    const [violations, setViolations] = useState<ViolationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchViolations = async () => {
            try {
                const res = await authApi.get('/admin/violations');
                setViolations(res.data.violations);
            } catch (error) {
                console.error('Failed to fetch violations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchViolations();
    }, []);

    const filteredViolations = violations.filter(v =>
        v.session_id.toLowerCase().includes(search.toLowerCase()) ||
        v.details.toLowerCase().includes(search.toLowerCase())
    );

    const handleExport = () => {
        if (!violations.length) return;

        const headers = ["Timestamp", "Session ID", "Type", "Severity", "Details"];
        const csvContent = [
            headers.join(","),
            ...violations.map(v => [
                new Date(v.timestamp).toISOString(),
                v.session_id,
                v.type,
                v.severity,
                `"${v.details.replace(/"/g, '""')}"` // Escape quotes in details
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `violations_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Violations Log</h1>
                    <p className="text-gray-400 mt-1">Audit trail of all detected anomalies</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search ID or Details..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors w-64"
                        />
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
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
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Session ID</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading violations...</td></tr>
                            ) : filteredViolations.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No violations found.</td></tr>
                            ) : (
                                filteredViolations.map((violation) => (
                                    <motion.tr
                                        key={violation._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(violation.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-purple-400">
                                            {violation.session_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300 capitalize">
                                            {violation.type.replace('_', ' ')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                                violation.severity === 'HIGH' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                    violation.severity === 'MEDIUM' ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                                                        "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                            )}>
                                                {violation.severity === 'HIGH' && <AlertTriangle className="w-3 h-3" />}
                                                {violation.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {violation.details}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {filteredViolations.length} results</span>
                    <div className="flex gap-2">
                        <button disabled className="p-1 rounded hover:bg-white/5 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                        <button disabled className="p-1 rounded hover:bg-white/5 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
