import { NextResponse, NextRequest } from 'next/server';
import OpenAIService from '@/services/open-ai.service';

const OpenAI = new OpenAIService();

export async function POST(req: NextRequest) {
  const prompt = req.nextUrl.searchParams.get('prompt');

  if (!prompt) {
    return NextResponse.json({ message: 'Please provide a prompt' });
  }

  try {
    const OpenAIResponse = await OpenAI.getChatResponse(prompt);
    return NextResponse.json({ message: OpenAIResponse });
  } catch (error) {
    return NextResponse.json({ message: 'Error' });
  }
}
