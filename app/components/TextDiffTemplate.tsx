'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSearch, Info, Sparkles, ArrowLeftRight, RotateCcw } from 'lucide-react'

type DiffType = 'added' | 'removed' | 'unchanged'

interface DiffLine {
  type: DiffType
  content: string
  lineNumber1?: number
  lineNumber2?: number
}

export default function TextDiffTemplate() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)

  // LCS-based diff algorithm (Longest Common Subsequence)
  const computeDiff = (str1: string, str2: string): DiffLine[] => {
    let lines1 = str1.split('\n')
    let lines2 = str2.split('\n')
    
    // Apply filters
    const normalize = (line: string) => {
      let normalized = line
      if (ignoreWhitespace) normalized = normalized.trim()
      if (ignoreCase) normalized = normalized.toLowerCase()
      return normalized
    }
    
    // Build LCS table
    const m = lines1.length
    const n = lines2.length
    const lcs: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0))
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (normalize(lines1[i - 1]) === normalize(lines2[j - 1])) {
          lcs[i][j] = lcs[i - 1][j - 1] + 1
        } else {
          lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1])
        }
      }
    }
    
    // Backtrack to build diff
    const result: DiffLine[] = []
    let i = m, j = n
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && normalize(lines1[i - 1]) === normalize(lines2[j - 1])) {
        result.unshift({ type: 'unchanged', content: lines1[i - 1], lineNumber1: i, lineNumber2: j })
        i--
        j--
      } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
        result.unshift({ type: 'added', content: lines2[j - 1], lineNumber2: j })
        j--
      } else if (i > 0) {
        result.unshift({ type: 'removed', content: lines1[i - 1], lineNumber1: i })
        i--
      }
    }
    
    return result
  }

  const diff = useMemo(() => computeDiff(text1, text2), [text1, text2, ignoreWhitespace, ignoreCase])

  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length
    const removed = diff.filter(d => d.type === 'removed').length
    const unchanged = diff.filter(d => d.type === 'unchanged').length
    return { added, removed, unchanged }
  }, [diff])

  const swapTexts = () => {
    const temp = text1
    setText1(text2)
    setText2(temp)
  }

  const clearAll = () => {
    setText1('')
    setText2('')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
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
                <FileSearch size={20} className="sm:hidden text-white" strokeWidth={2} />
                <FileSearch size={24} className="hidden sm:block text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Text Diff</h1>
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
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">Compare two texts • Line-by-line comparison • LCS algorithm • Visual highlighting</p>
          
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
                        <li>• Enter original text on the left</li>
                        <li>• Enter modified text on the right</li>
                        <li>• Uses LCS algorithm for accurate diffs</li>
                        <li>• Toggle whitespace/case sensitivity</li>
                        <li>• Green = added, Red = removed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Input Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        >
          {/* Original Text */}
          <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-white">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Original Text</h2>
            </div>
            <div className="p-6">
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Enter original text..."
                className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none font-mono text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Modified Text */}
          <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-white">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Modified Text</h2>
            </div>
            <div className="p-6">
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Enter modified text..."
                className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none font-mono text-xs sm:text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex gap-3 sm:gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                className="w-4 h-4 accent-gray-900 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Ignore Whitespace</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                className="w-4 h-4 accent-gray-900 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Ignore Case</span>
            </label>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-full text-sm font-semibold hover:border-gray-900 transition-all flex-1 sm:flex-none justify-center"
            >
              <RotateCcw size={16} />
              Clear
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={swapTexts}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm flex-1 sm:flex-none justify-center"
            >
              <ArrowLeftRight size={16} />
              Swap
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <AnimatePresence mode="wait">
          {(text1 || text2) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-700">{stats.added}</div>
                <div className="text-sm text-green-600">Lines Added</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="text-2xl font-bold text-red-700">{stats.removed}</div>
                <div className="text-sm text-red-600">Lines Removed</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-700">{stats.unchanged}</div>
                <div className="text-sm text-gray-600">Lines Unchanged</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Diff Results */}
        <AnimatePresence mode="wait">
          {(text1 || text2) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"
            >
              <div className="border-b border-gray-200 px-6 py-4 bg-white flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Differences</h2>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('split')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'split' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Split View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('unified')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'unified' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Unified View
                  </motion.button>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  {viewMode === 'unified' ? (
                    <div className="font-mono text-sm">
                      {diff.map((line, idx) => (
                        <div
                          key={idx}
                          className={`px-4 py-1 ${
                            line.type === 'added' ? 'bg-green-100 text-green-900' :
                            line.type === 'removed' ? 'bg-red-100 text-red-900' :
                            'text-gray-700'
                          }`}
                        >
                          <span className="inline-block w-8 text-gray-400 select-none">
                            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                          </span>
                          {line.content || ' '}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      <div className="font-mono text-sm">
                        {diff.filter(d => d.type !== 'added').map((line, idx) => (
                          <div
                            key={idx}
                            className={`px-4 py-1 ${
                              line.type === 'removed' ? 'bg-red-100 text-red-900' : 'text-gray-700'
                            }`}
                          >
                            <span className="inline-block w-8 text-gray-400 select-none">
                              {line.lineNumber1 || ''}
                            </span>
                            {line.content || ' '}
                          </div>
                        ))}
                      </div>
                      <div className="font-mono text-sm">
                        {diff.filter(d => d.type !== 'removed').map((line, idx) => (
                          <div
                            key={idx}
                            className={`px-4 py-1 ${
                              line.type === 'added' ? 'bg-green-100 text-green-900' : 'text-gray-700'
                            }`}
                          >
                            <span className="inline-block w-8 text-gray-400 select-none">
                              {line.lineNumber2 || ''}
                            </span>
                            {line.content || ' '}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!text1 && !text2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-300 shadow-sm p-12 text-center"
          >
            <FileSearch size={64} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="text-gray-500">Enter texts above to compare</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
