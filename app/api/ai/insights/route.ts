import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// The API must run on the Node.js runtime to support the generative AI client
export const runtime = 'nodejs';

const bodySchema = z.object({
  prompt: z.string().min(5),
  context: z.any().optional(),
});

// Initialise the Gemini client lazily. Do not instantiate if key is missing.
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

export async function POST(req: NextRequest) {
  let data: unknown;
  try {
    data = await req.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parseResult = bodySchema.safeParse(data);
  if (!parseResult.success) {
    return NextResponse.json({ error: 'Validation error', details: parseResult.error.issues }, { status: 400 });
  }
  const { prompt, context } = parseResult.data;
  const client = getGeminiClient();
  if (!client) {
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
  }
  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const messages: any[] = [];
    if (context) {
      messages.push({ role: 'user', parts: [{ text: `Here is some data summary for context: ${JSON.stringify(context)}` }] });
    }
    messages.push({ role: 'user', parts: [{ text: prompt }] });
    const response = await model.generateContent({ contents: messages });
    const text = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return NextResponse.json({ text });
  } catch (err) {
    // Hide error details to avoid leaking secrets
    return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 });
  }
}