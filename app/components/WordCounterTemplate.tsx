'use client'
import { useState } from 'react'
import { Type, FileText, Hash, AlignLeft, Clock, BookOpen, Ruler } from 'lucide-react'
import { motion } from 'framer-motion'

interface WordCounterTemplateProps {
  toolName: string
  description: string
  onProcess: (text: string, options: any) => Promise<any>
}

export default function WordCounterTemplate({ toolName, description, onProcess }: WordCounterTemplateProps) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleTextChange = async (value: string) => {
    setText(value)
    if (value.trim()) {
      try {
        const res = await onProcess(value, {})
        setResult(res)
      } catch (error) {
        console.error('Processing failed', error)
      }
    } else {
      setResult(null)
    }
  }

  const avgWordLength = result?.words && result?.characters 
    ? (result.characters / result.words).toFixed(1) 
    : '0.0'

  const stats = [
    { label: 'Words', value: result?.words || 0, icon: Type },
    { label: 'Characters', value: result?.characters || 0, icon: FileText },
    { label: 'Lines', value: result?.lines || 0, icon: AlignLeft },
    { label: 'Sentences', value: text ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0, icon: Hash },
    { label: 'Paragraphs', value: text ? text.split(/\n\n+/).filter(p => p.trim()).length : 0, icon: BookOpen },
    { label: 'Avg Word Length', value: avgWordLength, icon: Ruler },
    { label: 'Reading Time', value: result?.words ? `${Math.ceil(result.words / 200)}m` : '0m', icon: Clock },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
              <Type size={24} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{toolName}</h1>
            </div>
          </div>
          <p className="text-base text-gray-600 max-w-2xl">{description} • Real-time analysis • Click stats to highlight</p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Text Input - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Input Text</h2>
              </div>
              <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Start typing or paste your text here..."
                className="flex-1 p-6 pt-0 text-gray-900 placeholder-gray-400 focus:outline-none resize-none text-base leading-relaxed min-h-[500px]"
              />
              <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${text.length > 0 ? 'bg-gray-900 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">
                    {text.length > 0 ? 'Live analysis' : 'Ready'}
                  </span>
                </div>
                {text.length > 0 && (
                  <button
                    onClick={() => { setText(''); setResult(null); }}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Panel - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full">
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Analysis</h2>
              </div>
              <div className="p-6 pt-0 space-y-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-gray-400 bg-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
                          <stat.icon size={18} className="text-black" strokeWidth={2} />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                      </div>
                      <motion.span 
                        key={stat.value}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xl font-semibold text-gray-900 tabular-nums"
                      >
                        {stat.value}
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
