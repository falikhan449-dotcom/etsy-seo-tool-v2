'use client';

import { useState } from 'react';

interface OutputData {
  title: string;
  tags: string[];
  description: string;
}

export default function Home() {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Friendly and Engaging');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [output, setOutput] = useState<OutputData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a product name or topic.');
      return;
    }

    setLoading(true);
    setError('');
    setOutput(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: title,
          keywords: keywords,
          tone: tone,
        }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server error (${res.status}). Please check API key or terminal logs.`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI Generation failed');
      }

      setOutput(data);
    } catch (err: any) {
      console.error('Client Error:', err);
      setError(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Etsy AI SEO Listing Generator
          </h1>
          <p className="text-slate-400 text-lg">
            Generate optimized titles, 13 tags, and descriptions instantly.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Product Name / Topic
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Minimalist Digital Daily Planner 2026"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Keywords (comma separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. digital planner, daily planner pdf, iPad planner, printable template"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tone / Style
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="Friendly and Engaging">Friendly and Engaging</option>
                <option value="Professional & Clear">Professional & Clear</option>
                <option value="Aesthetic & Minimalist">Aesthetic & Minimalist</option>
                <option value="Persuasive & Sales-Oriented">Persuasive & Sales-Oriented</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Generating Listing... ✨</span>
              ) : (
                <span>Generate Etsy Listing ✨</span>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-950/60 border border-red-800 text-red-200 p-4 rounded-xl text-center shadow-lg">
            {error}
          </div>
        )}

        {/* Results Section */}
        {output && (
          <div className="space-y-6">
            {/* Title */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-indigo-400">Optimized Etsy Title</h2>
                <button
                  onClick={() => copyToClipboard(output.title, 'title')}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                >
                  {copiedField === 'title' ? 'Copied! ✓' : 'Copy Title'}
                </button>
              </div>
              <p className="text-slate-200 font-medium bg-slate-950 p-4 rounded-xl border border-slate-800/60 leading-relaxed">
                {output.title}
              </p>
            </div>

            {/* 13 Tags */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-indigo-400">13 Etsy SEO Tags</h2>
                <button
                  onClick={() => copyToClipboard(output.tags.join(', '), 'tags')}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                >
                  {copiedField === 'tags' ? 'Copied All! ✓' : 'Copy All Tags'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {output.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-indigo-950/70 border border-indigo-800/50 text-indigo-200 rounded-lg text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-indigo-400">Product Description</h2>
                <button
                  onClick={() => copyToClipboard(output.description, 'description')}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                >
                  {copiedField === 'description' ? 'Copied! ✓' : 'Copy Description'}
                </button>
              </div>
              <div className="text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/60 whitespace-pre-wrap leading-relaxed text-sm">
                {output.description}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}