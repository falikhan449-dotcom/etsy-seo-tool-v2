import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productName, targetKeywords, tone } = body;

    const prompt = `Act as an expert Etsy SEO and copywriting assistant. 
Create an optimized Etsy product listing based on the following details:
- Product Name/Topic: ${productName}
- Target Keywords: ${targetKeywords}
- Tone/Style: ${tone}

Please generate:
1. An SEO-optimized Etsy Listing Title (using high-volume keywords, max 140 characters).
2. 13 Etsy Search Tags (comma-separated, max 20 characters each).
3. A compelling, conversion-focused product description with sections for features, what's included, and how to use.

Format the output clearly.`;

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

    return NextResponse.json({ success: true, data: text });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
