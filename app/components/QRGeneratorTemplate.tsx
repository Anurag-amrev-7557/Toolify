'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Download, Info, Sparkles } from 'lucide-react'
import QRCodeLib from 'qrcode'

export default function QRGeneratorTemplate() {
  const [input, setInput] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [size, setSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#ffffff')
  const [margin, setMargin] = useState(2)
  const [template, setTemplate] = useState<'text' | 'url' | 'wifi' | 'email' | 'sms' | 'phone' | 'vcard' | 'location' | 'event'>('text')

  const generateQR = async () => {
    if (!input.trim()) return
    
    try {
      const qr = await QRCodeLib.toDataURL(input, {
        width: size,
        errorCorrectionLevel: errorLevel,
        margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      })
      setQrCode(qr)
    } catch (e) {
      console.error('Failed to generate QR code', e)
    }
  }

  const applyTemplate = (type: typeof template) => {
    setTemplate(type)
    switch (type) {
      case 'url':
        setInput('https://example.com')
        break
      case 'wifi':
        setInput('WIFI:T:WPA;S:YourNetworkName;P:YourPassword;;')
        break
      case 'email':
        setInput('mailto:name@example.com?subject=Hello&body=Message')
        break
      case 'sms':
        setInput('SMSTO:+1234567890:Hello there!')
        break
      case 'phone':
        setInput('tel:+1234567890')
        break
      case 'vcard':
        setInput('BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD')
        break
      case 'location':
        setInput('geo:37.7749,-122.4194?q=San Francisco')
        break
      case 'event':
        setInput('BEGIN:VEVENT\nSUMMARY:Meeting\nDTSTART:20240101T100000\nDTEND:20240101T110000\nLOCATION:Office\nEND:VEVENT')
        break
      default:
        setInput('')
    }
  }

  const downloadQR = () => {
    if (!qrCode) return
    const a = document.createElement('a')
    a.href = qrCode
    a.download = 'qrcode.png'
    a.click()
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
                <QrCode size={20} className="sm:hidden text-white" strokeWidth={2} />
                <QrCode size={24} className="hidden sm:block text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">QR Code Generator</h1>
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
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">Generate QR codes from text or URLs • Customizable size • Download as PNG</p>
          
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
                        <li>• Use templates for WiFi, Email, SMS, Phone</li>
                        <li>• Customize colors and size</li>
                        <li>• Adjust error correction level</li>
                        <li>• Download as PNG image</li>
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
          {/* QR Preview - 1 col */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 bg-white flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Preview</h2>
                {qrCode && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadQR}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download QR Code"
                  >
                    <Download size={18} className="text-gray-600" />
                  </motion.button>
                )}
              </div>
              <div className="p-6 flex-1 flex items-center justify-center">
                <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                  {qrCode ? (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={qrCode}
                      alt="QR Code"
                      className="max-w-full max-h-full"
                    />
                  ) : (
                    <div className="text-center">
                      <QrCode size={64} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
                      <p className="text-sm text-gray-500">Enter text to generate QR code</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Settings - 1 col */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Content</h2>
              </div>
              <div className="p-6 flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Template</label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {[
                        {v: 'text', l: 'Text'},
                        {v: 'url', l: 'URL'},
                        {v: 'wifi', l: 'WiFi'},
                        {v: 'email', l: 'Email'},
                        {v: 'sms', l: 'SMS'},
                        {v: 'phone', l: 'Phone'},
                        {v: 'vcard', l: 'vCard'},
                        {v: 'location', l: 'Location'},
                        {v: 'event', l: 'Event'}
                      ].map((t) => (
                        <motion.button
                          key={t.v}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => applyTemplate(t.v as any)}
                          className={`py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                            template === t.v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {t.l}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Content</label>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter text or URL..."
                      className="w-full h-24 sm:h-32 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 font-mono text-[10px] sm:text-xs resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateQR}
                  disabled={!input.trim()}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <QrCode size={18} />
                  <span>Generate QR Code</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Customization Settings - 1 col */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Customization</h2>
              </div>
              <div className="p-6 flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Size: {size}px</label>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      step="64"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Colors</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Foreground</label>
                        <input
                          type="color"
                          value={darkColor}
                          onChange={(e) => setDarkColor(e.target.value)}
                          className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Background</label>
                        <input
                          type="color"
                          value={lightColor}
                          onChange={(e) => setLightColor(e.target.value)}
                          className="w-full h-10 rounded-lg cursor-pointer border border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Margin: {margin}px</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={margin}
                      onChange={(e) => setMargin(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Error Correction</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                        <motion.button
                          key={level}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setErrorLevel(level)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                            errorLevel === level
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
