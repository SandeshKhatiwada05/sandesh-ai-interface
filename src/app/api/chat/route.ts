import { NextRequest, NextResponse } from 'next/server';

type ChatRole = 'system' | 'user' | 'assistant';

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ChatRequestBody = {
  messages?: ChatMessage[];
};

const MODEL = 'nvidia/nemotron-3-nano-30b-a3b:free';
const DEFAULT_SITE_URL = 'https://chat.khatiwadasandesh.com.np/';
const DEFAULT_SITE_NAME = 'Sandesh Portal'; 

// THE FIX: Direct, strict system rules injected into the pipeline backend
const HARDCODED_SYSTEM_PROMPT: ChatMessage = {
  role: 'system',
  content: 'You are the conversational heart of Sandesh AI. You must ALWAYS communicate strictly in English. Never use boring, generic, or robotic canned responses like "I don\'t have access to real-time data" or generic bullet-point templates. If you lack real-time data or news, be direct, conversational, witty, and deeply authentic instead of giving a generic overview. Keep your tone minimal, sharp, and intellectual.'
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    const referer = process.env.YOUR_SITE_URL || DEFAULT_SITE_URL;
    const siteName = process.env.YOUR_SITE_NAME ? encodeURIComponent(process.env.YOUR_SITE_NAME) : DEFAULT_SITE_NAME;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing OPENROUTER_API_KEY in environment variables.' },
        { status: 500 }
      );
    }

    let body: ChatRequestBody;
    try {
      body = (await request.json()) as ChatRequestBody;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
    }

    // Clean and clean incoming context history
    let cleanMessages = Array.isArray(body.messages)
      ? body.messages
          .filter((message): message is ChatMessage => {
            return (
              message !== null &&
              typeof message === 'object' &&
              (message.role === 'system' || message.role === 'user' || message.role === 'assistant') &&
              typeof message.content === 'string' &&
              message.content.trim().length > 0
            );
          })
      : [];

    // Ensure our custom persona overrides any conflicting client states
    // Strip any older system initializations and prepend our rigid ruleset
    cleanMessages = cleanMessages.filter(m => m.role !== 'system');
    const finalPayloadMessages = [HARDCODED_SYSTEM_PROMPT, ...cleanMessages].slice(-17); // 1 system + up to 16 history entries

    if (cleanMessages.length === 0) {
      return NextResponse.json({ error: 'At least one valid message is required.' }, { status: 400 });
    }

    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const targetUrl = `${cleanBaseUrl}/chat/completions`;

    const upstreamResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': referer,
        'X-OpenRouter-Title': siteName, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: finalPayloadMessages,
        stream: false,
        temperature: 0.7, // Slightly bumped to make the response voice more organic and alive
        top_p: 0.9
      })
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text().catch(() => 'Unable to read OpenRouter error body.');
      console.error(`OpenRouter upstream returned error ${upstreamResponse.status}:`, errorText);
      
      return NextResponse.json(
        { error: 'OpenRouter request failed.', detail: errorText },
        { status: upstreamResponse.status }
      );
    }

    const data = await upstreamResponse.json();
    const assistantText = data.choices?.[0]?.message?.content || 'No response returned from Nemotron.';

    return NextResponse.json({
      message: assistantText,
      usage: data.usage || null
    });

  } catch (error) {
    console.error('OpenRouter Route Level Crash:', error);
    const detail = error instanceof Error ? error.message : 'Unexpected server error.';
    return NextResponse.json(
      { error: 'Unable to complete the chat request due to an internal loop crash.', detail },
      { status: 500 }
    );
  }
}