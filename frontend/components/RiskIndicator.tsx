import React from 'react';

interface RiskIndicatorProps {
    score: number;
    status: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ score, status }) => {
    let color = 'bg-green-500';
    if (status === 'MEDIUM') color = 'bg-yellow-500';
    if (status === 'HIGH') color = 'bg-red-600';

    // Cap at 100 for visual simplicity
    const width = Math.min(score, 100);

    return (
        <div className="p-4 bg-white shadow rounded-lg mb-4">
            <h3 className="font-semibold mb-2 text-gray-700">Risk Score</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 relative">
                <div
                    className={`${color} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${width}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
                <span className="font-medium text-gray-600">Level: {status}</span>
                <span className="text-gray-500">{score.toFixed(1)} pts</span>
            </div>
        </div>
    );
};
