'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Copy, CheckCircle2, AlertCircle, FileJson, Download, Info, Sparkles, Eraser, FileCheck } from 'lucide-react'

export default function JsonFormatterTemplate() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [sortKeys, setSortKeys] = useState(false)
  const [stats, setStats] = useState<{chars: number, lines: number, size: string} | null>(null)

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys)
    }
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key) => {
          result[key] = sortObjectKeys(obj[key])
          return result
        }, {})
    }
    return obj
  }

  const calculateStats = (text: string) => {
    const chars = text.length
    const lines = text.split('\n').length
    const bytes = new Blob([text]).size
    const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
    setStats({ chars, lines, size })
  }

  const formatJson = () => {
    setError('')
    if (!input.trim()) {
      setError('Please enter JSON to format')
      return
    }
    try {
      let parsed = JSON.parse(input)
      if (sortKeys) parsed = sortObjectKeys(parsed)
      const formatted = JSON.stringify(parsed, null, indent)
      setInput(formatted)
      calculateStats(formatted)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }

  const minifyJson = () => {
    setError('')
    if (!input.trim()) {
      setError('Please enter JSON to minify')
      return
    }
    try {
      let parsed = JSON.parse(input)
      if (sortKeys) parsed = sortObjectKeys(parsed)
      const minified = JSON.stringify(parsed)
      setInput(minified)
      calculateStats(minified)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }

  const validateJson = () => {
    setError('')
    if (!input.trim()) {
      setError('Please enter JSON to validate')
      return
    }
    try {
      JSON.parse(input)
      setError('✓ Valid JSON')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }

  const escapeJson = () => {
    setError('')
    if (!input.trim()) {
      setError('Please enter JSON to escape')
      return
    }
    const escaped = JSON.stringify(input)
    setInput(escaped)
    calculateStats(escaped)
  }

  const unescapeJson = () => {
    setError('')
    if (!input.trim()) {
      setError('Please enter JSON to unescape')
      return
    }
    try {
      const unescaped = JSON.parse(input)
      if (typeof unescaped === 'string') {
        setInput(unescaped)
        calculateStats(unescaped)
      } else {
        setError('Input is not an escaped string')
      }
    } catch (e) {
      setError('Invalid escaped JSON string')
    }
  }

  const removeWhitespace = () => {
    setError('')
    if (!input.trim()) {
      setError('Please enter text')
      return
    }
    const cleaned = input.replace(/\s+/g, ' ').trim()
    setInput(cleaned)
    calculateStats(cleaned)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadJson = () => {
    const blob = new Blob([input], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
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
                <FileJson size={20} className="sm:hidden text-white" strokeWidth={2} />
                <FileJson size={24} className="hidden sm:block text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">JSON Formatter</h1>
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
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">Format, validate, and minify JSON data • Instant validation • Copy & download</p>
          
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
                        <li>• Format with custom indentation</li>
                        <li>• Minify to remove whitespace</li>
                        <li>• Sort keys alphabetically</li>
                        <li>• Escape/unescape strings</li>
                        <li>• Validate JSON syntax</li>
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
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">JSON Editor</h2>
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
                      onClick={downloadJson}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Download JSON"
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
                  placeholder='{"name": "John", "age": 30, "city": "New York"}'
                  className="w-full h-64 sm:h-96 px-3 sm:px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 font-mono text-xs sm:text-sm resize-none"
                />
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`mt-4 p-3 rounded-xl flex items-start gap-2 ${
                      error.startsWith('✓') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {error.startsWith('✓') ? (
                      <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                      <p className={`text-sm font-medium ${error.startsWith('✓') ? 'text-green-900' : 'text-red-900'}`}>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {stats && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 grid grid-cols-3 gap-3"
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

          {/* Right Column - Settings (1 col) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Actions</h2>
              </div>
              <div className="p-6 flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Indentation</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[2, 4, 8].map((spaces) => (
                        <motion.button
                          key={spaces}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIndent(spaces)}
                          className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                            indent === spaces
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {spaces}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sortKeys}
                        onChange={(e) => setSortKeys(e.target.checked)}
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">Sort keys alphabetically</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={formatJson}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Code2 size={18} />
                  <span>Format</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={minifyJson}
                  className="w-full py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Minify
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={validateJson}
                  className="w-full py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <FileCheck size={16} />
                  Validate
                </motion.button>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={escapeJson}
                    className="py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all text-xs"
                  >
                    Escape
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={unescapeJson}
                    className="py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all text-xs"
                  >
                    Unescape
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={removeWhitespace}
                  className="w-full py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Eraser size={16} />
                  Remove Whitespace
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
                <FileJson size={48} className="text-gray-300" strokeWidth={1.5} />
              </motion.div>
              <p className="text-sm text-gray-500">Enter JSON to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
