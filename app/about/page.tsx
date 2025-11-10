"use client"
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Users, Gift, Cpu, Globe, CheckCircle, Sparkles } from 'lucide-react'

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const faqs = [
    { q: 'What is Toolify?', a: 'Toolify is a collection of fast, privacy-first web utilities—PDF tools, image compressors, data formatters and small generators—designed to help you get work done without leaving the browser.' },
    { q: 'Is Toolify free to use?', a: 'Yes — core features are free to use. Some advanced or large-scale features may require special handling (check individual tool pages).' },
    { q: 'Where are my files processed?', a: 'Most tools run directly in your browser. When a backend is required (OCR, heavy conversions) we process files on secure servers and delete temporary files as soon as processing completes.' },
    { q: 'Can I contribute or request a tool?', a: 'Absolutely — Toolify is open to contributions and suggestions. Check the GitHub repo for contribution guidelines or open an issue.' },
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 scale-[110%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 dark:text-black rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium mb-6">
              <Sparkles size={14} /> Built for speed & privacy
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Powerful web utilities,
              <br /> designed for real work.
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mb-6">
              From PDFs to images and quick data tools — Toolify provides an elegant, modern toolkit that helps professionals and creators streamline repetitive tasks. No clutter, no nags, just results.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/" className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all">
                Browse Tools
                <ArrowRight size={16} />
              </Link>
              <a href="#why" className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                Why Toolify?
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden flex items-center justify-center p-8">
            <img src="/hero.webp" alt="Toolbox illustration" className="w-72 h-72 object-contain" />
          </div>
        </div>
      </section>

      {/* Why / Principles */}
      <section id="why" className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Our mission</h2>
              <p className="text-gray-600">Make small, high-impact utilities delightful and accessible to everyone — whether youre tidying documents, compressing images, or quick-formatting data.</p>
            </div>

            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mb-3">
                  <Gift size={18} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Free & Accessible</h3>
                <p className="text-sm text-gray-500">Core tools are free and fast — available with no signup friction.</p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mb-3">
                  <Cpu size={18} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Performance First</h3>
                <p className="text-sm text-gray-500">Many tools run client-side for speed and privacy; server-side options are efficient and ephemeral.</p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mb-3">
                  <Globe size={18} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Cross-platform</h3>
                <p className="text-sm text-gray-500">Works great on desktop and mobile — quick load times and responsive UI across devices.</p>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mb-3">
                  <Users size={18} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Community-driven</h3>
                <p className="text-sm text-gray-500">We listen to users and iterate quickly — feature requests and improvements help shape the product roadmap.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-gray-900">35+</div>
            <div className="text-sm text-gray-500">Utilities available</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-900">100%</div>
            <div className="text-sm text-gray-500">Free core tools</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-900">Privacy</div>
            <div className="text-sm text-gray-500">Client-first processing where possible</div>
          </div>
        </div>
      </section>

      {/* Team / Story */}
      <section className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Who we are</h2>
              <p className="text-gray-600 mb-6">A small team of product-minded engineers and designers building focused utilities that remove friction from everyday tasks. We value speed, clarity and privacy.</p>

              <div className="flex gap-3">
                <div className="flex items-center gap-3">
                  <img src="/icons/icon-192x192.png" alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-medium text-gray-900">Anurag Verma</div>
                    <div className="text-xs text-gray-500">Founder • Engineer</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-xl overflow-hidden bg-white border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Our story</h3>
                <p className="text-sm text-gray-600">Toolify started as a small set of browser utilities to speed up document workflows. Over time it grew into a unified toolkit with a focus on usability, accessibility and performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-4">
              <button className="w-full flex items-center justify-between gap-4" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{f.q}</div>
                  {openFaq === i && <div className="text-sm text-gray-600 mt-2">{f.a}</div>}
                </div>
                <div className="text-gray-400">
                  {openFaq === i ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </div>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Ready to save time?</h3>
            <p className="text-sm text-gray-200 mt-1">Dive into the tools and start improving your workflow today.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 rounded-full font-medium">
              Browse Tools
              <ArrowRight size={16} />
            </Link>
            <a href="https://github.com/Anurag-amrev-7557/Toolify" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 border border-white/25 rounded-full text-sm font-medium text-white/90 hover:bg-white/10">
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function ChevronUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <path d="M18 15l-6-6-6 6" />
    </svg>
  )
}
