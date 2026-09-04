'use client';

import { useState } from 'react';

export default function Home() {
  const [productName, setProductName] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [tone, setTone] = useState('Friendly and Engaging');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, targetKeywords, tone }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setResult('Error: ' + data.error);
      }
    } catch (err: any) {
      setResult('Something went wrong: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Etsy AI SEO Listing Generator
        </h1>
        <p className="text-slate-400 text-center mb-8">Generate optimized titles, 13 tags, and descriptions instantly.</p>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name / Topic</label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Minimalist Digital Daily Planner 2026"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Keywords (comma separated)</label>
            <input
              type="text"
              required
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              placeholder="e.g. digital planner, daily planner pdf, ipad planner"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tone / Style</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-purple-500"
            >
              <option value="Friendly and Engaging">Friendly and Engaging</option>
              <option value="Professional and Direct">Professional and Direct</option>
              <option value="Boho / Aesthetic">Boho / Aesthetic</option>
              <option value="Urgent & Promotional">Urgent & Promotional</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Generating SEO Content...' : 'Generate Etsy Listing'}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-slate-950 border border-slate-800 rounded-xl whitespace-pre-wrap text-slate-300">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">Generated Listing Results:</h2>
            {result}
          </div>
        )}
      </div>
    </main>
  );
}
