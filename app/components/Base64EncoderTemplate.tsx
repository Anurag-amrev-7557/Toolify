'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Copy, CheckCircle2, Download, Info, Sparkles, Upload } from 'lucide-react'

export default function Base64EncoderTemplate() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [stats, setStats] = useState<{chars: number, lines: number, size: string} | null>(null)

  const calculateStats = (text: string) => {
    const chars = text.length
    const lines = text.split('\n').length
    const bytes = new Blob([text]).size
    const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
    setStats({ chars, lines, size })
  }

  const encodeBase64 = () => {
    setError('')
    if (!input.trim()) {
      setError('Please enter text to encode')
      return
    }
    try {
      const encoded = btoa(input)
      setInput(encoded)
      calculateStats(encoded)
      setError('✓ Encoded to Base64')
    } catch (e) {
      setError('Failed to encode')
    }
  }

  const decodeBase64 = () => {
    setError('')
    if (!input.trim()) {
      setError('Please enter Base64 to decode')
      return
    }
    try {
      const decoded = atob(input)
      setInput(decoded)
      calculateStats(decoded)
      setError('✓ Decoded from Base64')
    } catch (e) {
      setError('Invalid Base64 string')
    }
  }



  const copyToClipboard = () => {
    navigator.clipboard.writeText(input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadText = () => {
    const blob = new Blob([input], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'base64.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-12"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-900 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Lock size={20} className="sm:hidden text-white" strokeWidth={2} />
                <Lock size={24} className="hidden sm:block text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Base64 Encoder</h1>
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
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">Encode and decode text or files to Base64 • Instant conversion • Copy & download</p>
          
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
                        <li>• Encode text or files to Base64</li>
                        <li>• Decode Base64 back to text</li>
                        <li>• Upload files for encoding</li>
                        <li>• Copy or download results</li>
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
          {/* Left Column - Input (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-white flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Text Editor</h2>
                {input && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <CheckCircle2 size={18} className="text-green-600" /> : <Copy size={18} className="text-gray-600" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={downloadText}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download size={18} className="text-gray-600" />
                    </motion.button>
                  </div>
                )}
              </div>
              <div className="p-6">
                <textarea
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(''); setStats(null); }}
                  placeholder="Enter text to encode or paste Base64 to decode..."
                  className="w-full h-64 sm:h-96 px-3 sm:px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 font-mono text-xs sm:text-sm resize-none"
                />
                {(error || stats) && <div className="mt-4" />}
                <AnimatePresence mode="wait">
                  {error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`p-3 rounded-xl flex items-start gap-2 ${
                          error.startsWith('✓') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <CheckCircle2 size={18} className={`${error.startsWith('✓') ? 'text-green-600' : 'text-red-600'} flex-shrink-0 mt-0.5`} />
                        <p className={`text-sm font-medium ${error.startsWith('✓') ? 'text-green-900' : 'text-red-900'}`}>{error}</p>
                      </motion.div>
                    )}
                </AnimatePresence>
                {stats && <div className="mt-4" />}
                <AnimatePresence mode="wait">
                  {stats && (
                      <motion.div
                        key="stats"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-3 gap-2 sm:gap-3"
                      >
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-xl text-center">
                          <p className="text-xs text-gray-500 mb-1">Characters</p>
                          <p className="text-sm sm:text-base font-bold text-gray-900">{stats.chars.toLocaleString()}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-xl text-center">
                          <p className="text-xs text-gray-500 mb-1">Lines</p>
                          <p className="text-sm sm:text-base font-bold text-gray-900">{stats.lines}</p>
                        </div>
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-xl text-center">
                          <p className="text-xs text-gray-500 mb-1">Size</p>
                          <p className="text-sm sm:text-base font-bold text-gray-900">{stats.size}</p>
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column - Actions (1 col) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Actions</h2>
              </div>
              <div className="p-6 flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Upload File</label>
                    <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-900 transition-colors cursor-pointer text-center">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            const result = event.target?.result as string
                            const base64 = result.split(',')[1]
                            setInput(base64)
                            calculateStats(base64)
                            setError('✓ File encoded to Base64')
                          }
                          reader.readAsDataURL(file)
                        }}
                        className="hidden"
                      />
                      <Upload size={20} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">Any file type</p>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={encodeBase64}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Lock size={18} />
                  <span>Encode</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={decodeBase64}
                  className="w-full py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Decode
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        <AnimatePresence>
          {!input && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block mb-4"
              >
                <Lock size={48} className="text-gray-300" strokeWidth={1.5} />
              </motion.div>
              <p className="text-sm text-gray-500">Enter text or upload a file to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
