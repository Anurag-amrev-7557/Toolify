'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Copy, CheckCircle2, RefreshCw, Info, Sparkles } from 'lucide-react'

export default function PasswordGeneratorTemplate() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong' | ''>('')
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const generatePassword = () => {
    let charset = ''
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let lower = 'abcdefghijklmnopqrstuvwxyz'
    let nums = '0123456789'
    let syms = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    if (excludeSimilar) {
      upper = upper.replace(/[IO]/g, '')
      lower = lower.replace(/[lo]/g, '')
      nums = nums.replace(/[01]/g, '')
    }
    
    if (excludeAmbiguous) {
      syms = syms.replace(/[{}\[\]()\/'"\`~,;:.<>]/g, '')
    }
    
    if (uppercase) charset += upper
    if (lowercase) charset += lower
    if (numbers) charset += nums
    if (symbols) charset += syms
    
    if (!charset) return
    
    let newPassword = ''
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    
    setPassword(newPassword)
    calculateStrength(newPassword)
    setHistory(prev => [newPassword, ...prev.slice(0, 4)])
  }

  const applyPreset = (preset: 'strong' | 'memorable' | 'pin') => {
    switch (preset) {
      case 'strong':
        setLength(20)
        setUppercase(true)
        setLowercase(true)
        setNumbers(true)
        setSymbols(true)
        setExcludeSimilar(false)
        setExcludeAmbiguous(false)
        break
      case 'memorable':
        setLength(12)
        setUppercase(true)
        setLowercase(true)
        setNumbers(true)
        setSymbols(false)
        setExcludeSimilar(true)
        setExcludeAmbiguous(true)
        break
      case 'pin':
        setLength(6)
        setUppercase(false)
        setLowercase(false)
        setNumbers(true)
        setSymbols(false)
        setExcludeSimilar(false)
        setExcludeAmbiguous(false)
        break
    }
  }

  const calculateStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 12) score++
    if (pwd.length >= 16) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    
    if (score <= 2) setStrength('weak')
    else if (score <= 4) setStrength('medium')
    else setStrength('strong')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
                <Shield size={20} className="sm:hidden text-white" strokeWidth={2} />
                <Shield size={24} className="hidden sm:block text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Password Generator</h1>
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
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">Generate secure random passwords • Customizable options • Strength indicator</p>
          
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
                        <li>• Use presets or customize options</li>
                        <li>• Exclude similar/ambiguous characters</li>
                        <li>• View password history</li>
                        <li>• Check strength indicator</li>
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
          {/* Password Display - 2 cols */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 bg-white flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Generated Password</h2>
                {password && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-green-600" /> : <Copy size={18} className="text-gray-600" />}
                  </motion.button>
                )}
              </div>
              <div className="p-6 flex-1 flex items-center justify-center">
                <motion.div
                  onClick={() => password && copyToClipboard()}
                  whileHover={password ? { scale: 1.02 } : {}}
                  whileTap={password ? { scale: 0.98 } : {}}
                  className={`bg-gray-50 rounded-xl p-6 w-full flex items-center justify-center transition-all ${
                    password ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                >
                  {password ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full relative"
                    >
                      <AnimatePresence>
                        {copied && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-12 left-[20rem] transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                          >
                            Copied!
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <p className="text-lg sm:text-2xl font-mono font-bold text-gray-900 break-all text-center mb-4">
                        {password}
                      </p>
                      {strength && (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm text-gray-600">Strength:</span>
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            strength === 'weak' ? 'bg-red-100 text-red-700' :
                            strength === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {strength.charAt(0).toUpperCase() + strength.slice(1)}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-center">
                      <Shield size={64} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
                      <p className="text-sm text-gray-500">Click generate to create a password</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Settings - 1 col */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Options</h2>
              </div>
              <div className="p-6 flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Length: {length}</label>
                    <input
                      type="range"
                      min="8"
                      max="64"
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                      <span>8</span>
                      <span>64</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Presets</label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-4">
                      {[{v: 'strong', l: 'Strong'}, {v: 'memorable', l: 'Easy'}, {v: 'pin', l: 'PIN'}].map((p) => (
                        <motion.button
                          key={p.v}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => applyPreset(p.v as any)}
                          className="py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg text-[10px] sm:text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                        >
                          {p.l}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Include</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={uppercase}
                        onChange={(e) => setUppercase(e.target.checked)}
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Uppercase (A-Z)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lowercase}
                        onChange={(e) => setLowercase(e.target.checked)}
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Lowercase (a-z)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={numbers}
                        onChange={(e) => setNumbers(e.target.checked)}
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={symbols}
                        onChange={(e) => setSymbols(e.target.checked)}
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Symbols (!@#$%...)</span>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Exclude</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={excludeSimilar}
                        onChange={(e) => setExcludeSimilar(e.target.checked)}
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Similar (i, l, 1, L, o, 0, O)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={excludeAmbiguous}
                        onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Ambiguous ({'{'}[()/'"...)</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Generate Button */}
              <div className="p-6 pt-0">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generatePassword}
                  disabled={!uppercase && !lowercase && !numbers && !symbols}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={18} />
                  <span>Generate Password</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Password History */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 bg-white">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Recent Passwords</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {history.map((pwd, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-mono text-sm text-gray-700">{pwd}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            navigator.clipboard.writeText(pwd)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          }}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Copy size={16} className="text-gray-600" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
