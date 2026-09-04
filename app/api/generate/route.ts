import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productName, targetKeywords, tone } = body;

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API Key is missing in Vercel." }, { status: 400 });
    }

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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: `Google API Error: ${data.error?.message || 'Unknown error'}` }, { status: response.status });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return NextResponse.json({ success: false, error: "Empty response from Gemini." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: text });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
