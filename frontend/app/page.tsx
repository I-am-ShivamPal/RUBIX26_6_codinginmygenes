'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const startExam = async () => {
        setLoading(true);
        // Simulate session creation
        const sessionId = "sess_" + Math.random().toString(36).substring(7);
        localStorage.setItem("proctor_session_id", sessionId);

        // Short delay for effect
        setTimeout(() => {
            router.push('/exam');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center">
                <div className="mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                        AI
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Smart Proctor</h1>
                    <p className="text-gray-500">Secure, AI-powered examination environment</p>
                </div>

                <div className="space-y-4 mb-8 text-left bg-gray-50 p-6 rounded-lg text-sm text-gray-600">
                    <p><strong>Instructions:</strong></p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Ensure you are in a well-lit room.</li>
                        <li>Keep your face visible at all times.</li>
                        <li>Do not look away or leave the frame.</li>
                        <li>Do not switch browser tabs.</li>
                    </ul>
                </div>

                <button
                    onClick={startExam}
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? "Initializing..." : "Start Examination"}
                </button>
            </div>
        </div>
    );
}
