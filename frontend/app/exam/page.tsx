'use client';

import { useWebcam } from '@/hooks/useWebcam';
import { useProctoring } from '@/hooks/useProctoring';
import { WebcamFeed } from '@/components/WebcamFeed';
import { RiskIndicator } from '@/components/RiskIndicator';
import { AlertPanel } from '@/components/AlertPanel';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

export default function ExamPage() {
    const { videoRef, canvasRef, error, captureFrame } = useWebcam();
    // In a real app, sessionId comes from context/url.
    // Generating a random one for demo if not present
    const [sessionId, setSessionId] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Check for real auth token
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login?redirect=/exam");
            return;
        }

        // For now, we can use the token as session ID or generate one if needed
        // but let's stick to the existing hook requirement if possible.
        // The hook uses sessionId to start proctoring.
        setSessionId("session_" + Math.random().toString(36).substring(7));
    }, [router]);

    const { risk, setIsProctoring, isProctoring, connectionStatus } = useProctoring(captureFrame, sessionId);
    const [showInstructions, setShowInstructions] = useState(true);

    useEffect(() => {
        if (sessionId) {
            setIsProctoring(true);
        }
    }, [sessionId, setIsProctoring]);

    if (!sessionId) return <div className="p-10">Loading session...</div>;

    return (
        <main className="min-h-screen bg-gray-50 p-8 relative">
            {/* Instruction Modal Overlay */}
            {showInstructions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-gray-200 text-center space-y-6">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Proctored Exam Session</h2>
                            <p className="text-gray-500 mt-2">
                                You are about to start a monitored examination. Artificial Intelligence is active to ensure academic integrity.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl text-left space-y-3 text-sm text-gray-700">
                            <div className="flex items-start gap-3">
                                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                                <p>Ensure you are in a well-lit environment and your face is clearly visible.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                                <p>Do not switch tabs or minimize the browser window.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                                <p>Remaining silent and looking away frequently may be flagged as suspicious.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowInstructions(false)}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                            I Understand, Start Exam
                        </button>
                    </div>
                </div>
            )}

            <div className={clsx("max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8", showInstructions && "blur-sm pointer-events-none")}>

                {/* Left Column: Exam Content Placeholder */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Final Examination: AI Ethics</h1>
                        <p className="mb-4 text-gray-600">
                            Please answer the questions below. Your session is being monitored.
                            Do not switch tabs or look away from the screen.
                        </p>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="font-medium mb-2">Question 1: Explain the trolley problem in context of AVs.</p>
                                <textarea className="w-full h-32 p-2 border rounded" placeholder="Type your answer..."></textarea>
                            </div>
                            <div className="p-4 bg-gray-50 rounded border">
                                <p className="font-medium mb-2">Question 2: Define Superintelligence.</p>
                                <textarea className="w-full h-32 p-2 border rounded" placeholder="Type your answer..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Proctoring Panel */}
                <div className="space-y-6">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                            Camera Error: {error}
                        </div>
                    )}

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Live Feed</h3>
                        <WebcamFeed
                            videoRef={videoRef}
                            canvasRef={canvasRef}
                            isProctoring={isProctoring}
                            faceCount={risk.faceCount}
                            headPose={risk.headPose}
                            connectionStatus={connectionStatus}
                        />
                        <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-medium bg-green-50 p-2 rounded-lg">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Proctoring Active</span>
                        </div>
                    </div>

                    {/* Hidden from student view: RiskIndicator & AlertPanel */}

                    <button
                        onClick={() => {
                            // localStorage.removeItem("token");
                            router.push("/");
                        }}
                        className="w-full py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                    >
                        End Exam
                    </button>
                </div>

            </div>
        </main>
    );
}
