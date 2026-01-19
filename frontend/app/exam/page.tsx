'use client';

import { useWebcam } from '@/hooks/useWebcam';
import { useProctoring } from '@/hooks/useProctoring';
import { WebcamFeed } from '@/components/WebcamFeed';
import { RiskIndicator } from '@/components/RiskIndicator';
import { AlertPanel } from '@/components/AlertPanel';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExamPage() {
    const { videoRef, canvasRef, error, captureFrame } = useWebcam();
    // In a real app, sessionId comes from context/url.
    // Generating a random one for demo if not present
    const [sessionId, setSessionId] = useState("");
    const router = useRouter();

    useEffect(() => {
        const sid = localStorage.getItem("proctor_session_id");
        if (!sid) {
            router.push("/");
        } else {
            setSessionId(sid);
        }
    }, [router]);

    const { risk, setIsProctoring, isProctoring, connectionStatus } = useProctoring(captureFrame, sessionId);

    useEffect(() => {
        if (sessionId) {
            setIsProctoring(true);
        }
    }, [sessionId, setIsProctoring]);

    if (!sessionId) return <div className="p-10">Loading session...</div>;

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

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

                    <WebcamFeed
                        videoRef={videoRef}
                        canvasRef={canvasRef}
                        isProctoring={isProctoring}
                        faceCount={risk.faceCount}
                        headPose={risk.headPose}
                        connectionStatus={connectionStatus}
                    />

                    <RiskIndicator score={risk.score} status={risk.status} />

                    <AlertPanel violations={risk.violations} />

                    <button
                        onClick={() => {
                            localStorage.removeItem("proctor_session_id");
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
