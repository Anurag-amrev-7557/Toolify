'use client'
import { useState } from 'react'
import { Key, Copy, RefreshCw, Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface UUIDGeneratorTemplateProps {
  toolName: string
  description: string
  onGenerate: () => Promise<any>
}

export default function UUIDGeneratorTemplate({ toolName, description, onGenerate }: UUIDGeneratorTemplateProps) {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    const newUuids: string[] = []
    for (let i = 0; i < count; i++) {
      const res = await onGenerate()
      newUuids.push(res.uuid)
    }
    setUuids(newUuids)
    setGenerating(false)
  }

  const handleCopy = (uuid: string, index: number) => {
    navigator.clipboard.writeText(uuid)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'))
    setCopiedIndex(-1)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
              <Key size={24} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{toolName}</h1>
            </div>
          </div>
          <p className="text-base text-gray-600 max-w-2xl">{description} • RFC 4122 compliant • One-click copy</p>
        </div>

        {/* Generator Controls */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-200 px-6 py-4 bg-white">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Generate UUIDs</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of UUIDs</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2 font-medium"
                >
                  <RefreshCw size={18} className={generating ? 'animate-spin' : ''} />
                  {generating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {uuids.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-200 px-6 py-4 bg-white flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Generated UUIDs ({uuids.length})
              </h2>
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copiedIndex === -1 ? <Check size={16} /> : <Copy size={16} />}
                Copy All
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
              {uuids.map((uuid, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
                  onClick={() => handleCopy(uuid, index)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-900 transition-all group cursor-pointer"
                >
                  <code className="flex-1 font-mono text-sm text-gray-900 select-all">{uuid}</code>
                  <div className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedIndex === index ? (
                      <Check size={16} className="text-gray-900" />
                    ) : (
                      <Copy size={16} className="text-gray-600" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {uuids.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Key size={32} className="text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No UUIDs Generated Yet</h3>
              <p className="text-gray-600">Click the generate button to create unique identifiers</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
