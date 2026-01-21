'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Bell, Shield, Lock, Eye, Database } from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Database },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">Manage system configuration and preferences</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all font-medium text-left",
                                    activeTab === tab.id
                                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
                    {activeTab === 'general' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">General Configuration</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-800">
                                    <div>
                                        <h4 className="text-white font-medium">Maintenance Mode</h4>
                                        <p className="text-sm text-gray-500">Disable student access temporarily</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors cursor-pointer">
                                        <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-800">
                                    <div>
                                        <h4 className="text-white font-medium">Debug Logging</h4>
                                        <p className="text-sm text-gray-500">Enable verbose system logs</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-colors cursor-pointer">
                                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Security Parameters</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Max Risk Threshold</label>
                                    <input type="number" defaultValue={50} className="bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white w-full max-w-xs focus:border-purple-500 outline-none" />
                                    <p className="text-xs text-gray-600 mt-1">Sessions exceeding this score are flagged as Critical.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-4">Alert Preferences</h3>
                            <p className="text-gray-500">Notification settings are currently disabled.</p>
                        </motion.div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
