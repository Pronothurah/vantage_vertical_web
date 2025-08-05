import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Contact form API route will be implemented in subsequent tasks
  return NextResponse.json(
    { message: 'Contact form API route - to be implemented' },
    { status: 200 }
  );
}