'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Droplets, Download, CheckCircle2, Loader2, FileText, Info, Sparkles } from 'lucide-react'
import { API_URL } from '../lib/config'

interface PDFWatermarkTemplateProps {
  toolName: string
  description: string
}

export default function PDFWatermarkTemplate({ toolName, description }: PDFWatermarkTemplateProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
  const [fontSize, setFontSize] = useState(50)
  const [opacity, setOpacity] = useState(30)
  const [rotation, setRotation] = useState(45)
  const [showInfo, setShowInfo] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile)
      setResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setResult(null)
    }
  }

  const handleWatermark = async () => {
    if (!file) return
    
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('text', watermarkText)
      formData.append('fontSize', fontSize.toString())
      formData.append('opacity', (opacity / 100).toString())
      formData.append('rotation', rotation.toString())
      
      const response = await fetch(`${API_URL}/api/process/pdf-watermark`, {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setResult({ url })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Droplets size={24} className="text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{toolName}</h1>
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
          <p className="text-base text-gray-600 max-w-2xl">{description} • Customizable text & position • Secure & private</p>
          
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
                        <li>• Upload your PDF file</li>
                        <li>• Customize watermark text, size, and opacity</li>
                        <li>• Adjust rotation angle for diagonal watermarks</li>
                        <li>• All processing happens securely in your browser</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`bg-white rounded-2xl border-2 border-dashed transition-all duration-200 mb-6 ${
                isDragging ? 'border-gray-900 bg-gray-50 scale-[1.02]' : 'border-gray-300'
              }`}
            >
              <label className="block p-12 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                    isDragging ? 'border-gray-900 bg-gray-900' : 'border-gray-400 bg-transparent'
                  }`}>
                    <Upload size={28} className={isDragging ? 'text-white dark:text-gray-600' : 'text-gray-600'} strokeWidth={2} />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {isDragging ? 'Drop your PDF here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500">PDF files only</p>
                  </div>
                </div>
              </label>
            </motion.div>
          ) : !result ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileText size={20} className="text-gray-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 border border-gray-300"
                  >
                    Change
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Preview</h4>
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
                    <span 
                      className="font-bold text-gray-400 select-none"
                      style={{ 
                        fontSize: `${Math.min(fontSize / 3, 24)}px`,
                        opacity: opacity / 100,
                        transform: `rotate(${rotation}deg)`
                      }}
                    >
                      {watermarkText}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">Watermark Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 block">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Enter watermark text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Font Size</label>
                      <span className="text-sm font-semibold text-gray-900">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>20px</span>
                      <span>100px</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Opacity</label>
                      <span className="text-sm font-semibold text-gray-900">{opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={opacity}
                      onChange={(e) => setOpacity(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>10%</span>
                      <span>80%</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Rotation</label>
                      <span className="text-sm font-semibold text-gray-900">{rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0°</span>
                      <span>90°</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWatermark}
                disabled={isProcessing || !watermarkText.trim()}
                className="relative w-full py-5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: isProcessing ? '100%' : '-100%' }}
                  transition={{ duration: 1.5, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
                />
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Adding Watermark...</span>
                  </>
                ) : (
                  <>
                    <Droplets size={20} className="group-hover:rotate-12 transition-transform" />
                    <span>Add Watermark to PDF</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white rounded-2xl border border-emerald-300 shadow-lg overflow-hidden"
            >
              <div className="border-b border-emerald-200 px-6 py-4 bg-emerald-50">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                  >
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  </motion.div>
                  <h2 className="text-sm font-semibold text-emerald-900 uppercase tracking-wide">
                    Watermark Added
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <FileText size={24} className="text-emerald-600" strokeWidth={2} />
                    </motion.div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">watermarked.pdf</p>
                      <p className="text-xs text-gray-500">Watermark applied • Ready to download</p>
                    </div>
                  </div>
                </motion.div>
                <div className="space-y-3">
                  <motion.a
                    href={result.url}
                    download="watermarked.pdf"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Download size={18} />
                    Download Watermarked PDF
                  </motion.a>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setFile(null); setResult(null); }}
                    className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Droplets size={18} />
                    Watermark Another PDF
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!file && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div className="inline-block mb-4">
                <Droplets size={48} className="text-gray-300" strokeWidth={1.5} />
              </motion.div>
              <p className="text-sm text-gray-500">Upload a PDF file to add watermark</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
