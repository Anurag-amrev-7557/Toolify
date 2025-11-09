'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hash, Info, Sparkles, Copy, CheckCircle2 } from 'lucide-react'

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512'

export default function HashGeneratorTemplate() {
  const [input, setInput] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<HashAlgorithm>('SHA-256')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const algorithms: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512']

  const generateHash = async (text: string, algorithm: HashAlgorithm): Promise<string> => {
    if (!text) return ''
    
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    
    let hashBuffer: ArrayBuffer
    
    if (algorithm === 'MD5') {
      // MD5 not natively supported, return placeholder
      return 'MD5 requires external library'
    } else if (algorithm === 'SHA-1') {
      hashBuffer = await crypto.subtle.digest('SHA-1', data)
    } else if (algorithm === 'SHA-256') {
      hashBuffer = await crypto.subtle.digest('SHA-256', data)
    } else if (algorithm === 'SHA-512') {
      hashBuffer = await crypto.subtle.digest('SHA-512', data)
    } else {
      return ''
    }
    
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({
    'MD5': '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-512': ''
  })

  const handleInputChange = async (text: string) => {
    setInput(text)
    if (!text) {
      setHashes({ 'MD5': '', 'SHA-1': '', 'SHA-256': '', 'SHA-512': '' })
      return
    }
    
    const newHashes: Record<HashAlgorithm, string> = {
      'MD5': 'MD5 requires external library',
      'SHA-1': await generateHash(text, 'SHA-1'),
      'SHA-256': await generateHash(text, 'SHA-256'),
      'SHA-512': await generateHash(text, 'SHA-512')
    }
    setHashes(newHashes)
  }

  const copyHash = (hash: string, algorithm: HashAlgorithm) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(algorithm)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.div
                className="bg-gray-900 p-2 sm:p-3 rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Hash size={20} className="sm:hidden text-white" strokeWidth={2} />
                <Hash size={24} className="hidden sm:block text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Hash Generator</h1>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-lg border border-gray-300 hover:border-gray-900 transition-colors"
            >
              <Info size={20} className="text-gray-600" />
            </motion.button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">Generate cryptographic hashes • Multiple algorithms • Instant results</p>
          
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">How it works:</p>
                      <ul className="space-y-1 text-blue-800">
                        <li>• Enter text to generate hashes</li>
                        <li>• Supports SHA-1, SHA-256, SHA-512</li>
                        <li>• All processing happens in your browser</li>
                        <li>• Click any hash to copy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* Input - 2 cols */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Input Text</h2>
              </div>
              <div className="p-6">
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter text to hash..."
                  className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none font-mono text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Algorithm Selection - 1 col */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Algorithms</h2>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {algorithms.map((algo) => (
                    <motion.button
                      key={algo}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedAlgorithm(algo)}
                      className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                        selectedAlgorithm === algo
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {algo}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {input && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {algorithms.map((algo) => (
                <motion.div
                  key={algo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">{algo}</span>
                      <span className="text-xs text-gray-500">({hashes[algo].length} characters)</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyHash(hashes[algo], algo)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy hash"
                    >
                      {copiedHash === algo ? (
                        <CheckCircle2 size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} className="text-gray-600" />
                      )}
                    </motion.button>
                  </div>
                  <div className="px-6 pb-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="font-mono text-sm text-gray-900 break-all">
                        {hashes[algo] || 'Generating...'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!input && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-300 shadow-sm p-12 text-center"
          >
            <Hash size={64} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="text-gray-500">Enter text above to generate hashes</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
