import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'This is the Open AI route' });
}
