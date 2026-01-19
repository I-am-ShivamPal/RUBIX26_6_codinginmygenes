import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface AlertPanelProps {
    violations: string[];
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ violations }) => {
    return (
        <div className="p-4 bg-white shadow rounded-lg h-60 overflow-y-auto">
            <h3 className="font-semibold mb-2 text-gray-700 flex items-center gap-2">
                <AlertTriangle size={20} className="text-orange-500" />
                Recent Alerts
            </h3>
            {violations.length === 0 ? (
                <p className="text-gray-400 text-sm">No recent violations detected.</p>
            ) : (
                <ul className="space-y-2">
                    {violations.map((v, i) => (
                        <li key={i} className="text-sm bg-red-50 text-red-700 p-2 rounded border border-red-100 animate-pulse">
                            {v}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
