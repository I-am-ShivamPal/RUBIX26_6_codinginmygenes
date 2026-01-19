import React from 'react';

interface WebcamFeedProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    isProctoring: boolean;
    faceCount: number;
    headPose: string;
    connectionStatus: string;
}

export const WebcamFeed: React.FC<WebcamFeedProps> = ({
    videoRef,
    canvasRef,
    isProctoring,
    faceCount,
    headPose,
    connectionStatus
}) => {
    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg border-4 border-gray-800">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
            />
            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Status Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className={`px-2 py-1 rounded text-xs text-white font-mono flex items-center gap-2 ${connectionStatus === 'connected' ? 'bg-green-600/80' : 'bg-red-600/80'}`}>
                    <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-300 animate-pulse' : 'bg-white'}`}></div>
                    System: {connectionStatus.toUpperCase()}
                </div>
                {isProctoring && (
                    <>
                        <div className="px-2 py-1 rounded text-xs text-white font-mono bg-black/60 backdrop-blur-sm border border-white/20">
                            Faces Detected: <span className={faceCount !== 1 ? "text-red-400 font-bold" : "text-green-400"}>{faceCount}</span>
                        </div>
                        <div className="px-2 py-1 rounded text-xs text-white font-mono bg-black/60 backdrop-blur-sm border border-white/20">
                            Head Pose: <span className={headPose !== 'center' ? "text-yellow-400 font-bold" : "text-green-400"}>{headPose}</span>
                        </div>
                    </>
                )}
            </div>

            <div className="absolute top-4 right-4 animate-pulse">
                <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <p className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded text-xs">
                {isProctoring ? "Live Proctoring Active" : "Camera Ready"}
            </p>
        </div>
    );
};
