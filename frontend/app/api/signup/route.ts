import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { email, password, full_name, role } = body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { detail: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password (password received is likely already SHA256 from client, but we treat it as raw string to bcrypt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            email,
            full_name,
            role,
            hashed_password: hashedPassword,
        });

        return NextResponse.json({
            id: newUser._id,
            email: newUser.email,
            full_name: newUser.full_name,
            role: newUser.role,
            is_active: newUser.is_active,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Signup Error Detailed:', error);
        return NextResponse.json(
            { detail: `Signup Error: ${error.message}` },
            { status: 500 }
        );
    }
}
