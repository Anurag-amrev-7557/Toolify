'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaseSensitive, Info, Sparkles, Copy, CheckCircle2 } from 'lucide-react'

type CaseType = 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase' | 'camelcase' | 'pascalcase' | 'snakecase' | 'kebabcase'

export default function CaseConverterTemplate() {
  const [input, setInput] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [copiedCase, setCopiedCase] = useState<CaseType | null>(null)

  const convertCase = (text: string, caseType: CaseType): string => {
    if (!text) return ''
    
    switch (caseType) {
      case 'uppercase':
        return text.toUpperCase()
      
      case 'lowercase':
        return text.toLowerCase()
      
      case 'titlecase':
        return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
      
      case 'sentencecase':
        return text.toLowerCase().replace(/(^\w|\.\s+\w)/g, char => char.toUpperCase())
      
      case 'camelcase':
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^[A-Z]/, char => char.toLowerCase())
      
      case 'pascalcase':
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^[a-z]/, char => char.toUpperCase())
      
      case 'snakecase':
        return text
          .replace(/\s+/g, '_')
          .replace(/[A-Z]/g, char => `_${char.toLowerCase()}`)
          .replace(/^_/, '')
          .toLowerCase()
      
      case 'kebabcase':
        return text
          .replace(/\s+/g, '-')
          .replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)
          .replace(/^-/, '')
          .toLowerCase()
      
      default:
        return text
    }
  }

  const cases: { type: CaseType; label: string; example: string }[] = [
    { type: 'uppercase', label: 'UPPERCASE', example: 'HELLO WORLD' },
    { type: 'lowercase', label: 'lowercase', example: 'hello world' },
    { type: 'titlecase', label: 'Title Case', example: 'Hello World' },
    { type: 'sentencecase', label: 'Sentence case', example: 'Hello world' },
    { type: 'camelcase', label: 'camelCase', example: 'helloWorld' },
    { type: 'pascalcase', label: 'PascalCase', example: 'HelloWorld' },
    { type: 'snakecase', label: 'snake_case', example: 'hello_world' },
    { type: 'kebabcase', label: 'kebab-case', example: 'hello-world' },
  ]

  const copyResult = (text: string, caseType: CaseType) => {
    navigator.clipboard.writeText(text)
    setCopiedCase(caseType)
    setTimeout(() => setCopiedCase(null), 2000)
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
                <CaseSensitive size={20} className="sm:hidden text-white" strokeWidth={2} />
                <CaseSensitive size={24} className="hidden sm:block text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Case Converter</h1>
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
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">Convert text to different cases • 8 case styles • Instant conversion</p>
          
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
                        <li>• Enter text to convert</li>
                        <li>• View all case conversions instantly</li>
                        <li>• Click copy button to copy result</li>
                        <li>• Supports programming case styles</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-200 px-6 py-4 bg-white">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Input Text</h2>
          </div>
          <div className="p-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to convert..."
              className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-xs sm:text-sm"
            />
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {input && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            >
              {cases.map((caseItem) => {
                const result = convertCase(input, caseItem.type)
                return (
                  <motion.div
                    key={caseItem.type}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden"
                  >
                    <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xs font-semibold text-gray-900">{caseItem.label}</h3>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{caseItem.example}</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                          <p className="text-xs sm:text-sm text-gray-900 break-words truncate">
                            {result}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyResult(result, caseItem.type)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        title="Copy result"
                      >
                        {copiedCase === caseItem.type ? (
                          <CheckCircle2 size={16} className="text-green-600" />
                        ) : (
                          <Copy size={16} className="text-gray-600" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
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
            <CaseSensitive size={64} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <p className="text-gray-500 mb-2">Enter text above to convert</p>
            <p className="text-xs text-gray-400">Supports 8 different case styles</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
