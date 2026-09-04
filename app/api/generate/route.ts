import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { productTitle, keywords, tone } = await req.json();

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});
    const prompt = `You are an Etsy SEO expert. Generate an optimized listing for:
Product Name: ${productTitle}
Target Keywords: ${keywords}
Tone: ${tone || 'Friendly and Engaging'}

Return ONLY a valid JSON object matching this exact structure:
{
  "title": "Etsy SEO Title here",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11", "tag12", "tag13"],
  "description": "Full product description here"
}`;

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const text = response.response.text();
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Gemini Server Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI Generation failed' },
      { status: 500 }
    );
  }
}
