import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import Violation from '@/models/Violation';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        // Fetch recent sessions (limit 50)
        const sessions = await Session.find()
            .sort({ last_active: -1 })
            .limit(50)
            .lean();

        // Enhance sessions with recent violation count (optional enhancement)
        // For now, returning raw session data is sufficient for the MVP 
        // as risks are already aggregated in `cum_risk_score`.

        return NextResponse.json({ sessions });
    } catch (error: any) {
        console.error('Sessions API Error:', error);
        return NextResponse.json(
            { detail: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
