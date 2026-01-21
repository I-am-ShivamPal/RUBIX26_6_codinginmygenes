import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-this-in-prod';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { email, password } = body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { detail: 'Incorrect email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
            return NextResponse.json(
                { detail: 'Incorrect email or password' },
                { status: 401 }
            );
        }

        // Generate token
        const token = jwt.sign(
            { sub: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        return NextResponse.json({
            access_token: token,
            token_type: 'bearer',
            user: {
                email: user.email,
                full_name: user.full_name,
                role: user.role,
            },
        });

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { detail: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
