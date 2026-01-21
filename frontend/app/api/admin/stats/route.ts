import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import Violation from '@/models/Violation';

export const dynamic = 'force-dynamic'; // Ensure real-time data

export async function GET() {
    try {
        await connectDB();

        // 1. Total Sessions
        const totalSessions = await Session.countDocuments();

        // 2. Active Sessions (Last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeSessions = await Session.countDocuments({
            last_active: { $gte: fiveMinutesAgo },
        });

        // 3. High Risk Sessions (> 50 score)
        const highRiskSessions = await Session.countDocuments({
            cum_risk_score: { $gt: 50 },
        });

        // 4. Total Violations
        const totalViolations = await Violation.countDocuments();

        return NextResponse.json({
            totalSessions,
            activeSessions,
            highRiskSessions,
            totalViolations,
        });
    } catch (error: any) {
        console.error('Stats API Error:', error);
        return NextResponse.json(
            { detail: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
