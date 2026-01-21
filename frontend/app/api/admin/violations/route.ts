import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Violation from '@/models/Violation';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();

        const violations = await Violation.find()
            .sort({ timestamp: -1 })
            .limit(100) // Limit to last 100 for now, add pagination later if needed
            .lean();

        return NextResponse.json({ violations });
    } catch (error: any) {
        console.error('Violations API Error:', error);
        return NextResponse.json(
            { detail: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
