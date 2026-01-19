import { useState, useEffect, useCallback } from 'react';
import { API_URL, FRAME_INTERVAL } from '../lib/constants';
import axios from 'axios';

interface RiskState {
    score: number;
    violations: string[];
    status: 'LOW' | 'MEDIUM' | 'HIGH';
    faceCount: number;
    headPose: string;
}

export const useProctoring = (
    captureFrame: () => string | null,
    sessionId: string
) => {
    const [risk, setRisk] = useState<RiskState>({
        score: 0,
        violations: [],
        status: 'LOW',
        faceCount: 0,
        headPose: 'unknown'
    });
    const [isProctoring, setIsProctoring] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');

    const logEvent = useCallback(async (eventType: string) => {
        try {
            await axios.post(`${API_URL}/log-event`, {
                session_id: sessionId,
                event_type: eventType,
                timestamp: new Date().toISOString()
            });
            // Optimistically update risk for events if needed, but backend handles it
        } catch (err) {
            console.error("Failed to log event", err);
        }
    }, [sessionId]);

    useEffect(() => {
        if (!isProctoring) return;

        const interval = setInterval(async () => {
            const image = captureFrame();
            if (image) {
                try {
                    const res = await axios.post(`${API_URL}/analyze-frame`, {
                        session_id: sessionId,
                        image: image,
                        timestamp: new Date().toISOString()
                    });

                    const { risk_score_increment, violations, face_count, head_pose } = res.data;

                    setConnectionStatus('connected');

                    setRisk(prev => {
                        const newScore = prev.score + risk_score_increment;
                        let status: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
                        if (newScore > 50) status = 'MEDIUM';
                        if (newScore > 100) status = 'HIGH';

                        // Keep last 5 violations for display
                        const newViolations = [...violations, ...prev.violations].slice(0, 5);

                        return {
                            score: newScore,
                            violations: newViolations,
                            status: status,
                            faceCount: face_count,
                            headPose: head_pose
                        };
                    });

                } catch (err) {
                    console.error("Proctoring API error", err);
                    setConnectionStatus('error');
                }
            }
        }, FRAME_INTERVAL);

        return () => clearInterval(interval);
    }, [isProctoring, captureFrame, sessionId]);

    // Tab visibility and Window focus monitoring
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                logEvent('tab_hidden');
                setRisk(prev => ({ ...prev, violations: ['Tab switch detected', ...prev.violations] }));
            }
        };

        const handleWindowBlur = () => {
            logEvent('window_blur');
            setRisk(prev => ({ ...prev, violations: ['Exam window lost focus', ...prev.violations] }));
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [logEvent]);

    return { risk, setIsProctoring, isProctoring, connectionStatus };
};
