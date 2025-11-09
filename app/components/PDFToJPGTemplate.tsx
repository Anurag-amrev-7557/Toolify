'use client'
import { useState } from 'react'
import { Image as ImageIcon, Upload, Download, Loader2, CheckCircle2, FileText, Info, Sparkles, ArrowUpDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../lib/config'

export default function PDFToJPGTemplate({ toolName, description }: any) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [previewCollapsed, setPreviewCollapsed] = useState<boolean>(false)

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const handleConvert = async () => {
    if (!file) return
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch(`${API_URL}/api/process/pdf-to-jpg`, {
        method: 'POST',
        body: formData,
      })
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResult({ url })
    } catch (error) {
      console.error('Convert failed', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ImageIcon size={24} className="text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{toolName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="sm:hidden">
                <button onClick={() => setPreviewCollapsed(p => !p)} aria-label="Toggle preview" className="px-2 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  <ArrowUpDown size={16} />
                </button>
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
          </div>
          <p className="text-base text-gray-600 max-w-2xl">{description} • Secure & private</p>
          
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
                        <li>• Each page converted to JPG image</li>
                        <li>• Download as ZIP file</li>
                        <li>• All processing happens securely</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); setFile(e.dataTransfer.files[0]) }}
          className={`bg-white rounded-2xl border-2 border-dashed transition-all mb-6 ${isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
        >
          <label className="block p-12 cursor-pointer">
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${isDragging ? 'border-gray-900 bg-gray-900' : 'border-gray-400'}`}>
                <Upload size={28} className={isDragging ? 'text-white dark:text-gray-600' : 'text-gray-600'} />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PDF file only</p>
              </div>
            </div>
          </label>
        </motion.div>

        {/* File Preview */}
        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden mb-6"
            >
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Selected File</h2>
              </div>
              <div className={`${previewCollapsed ? 'hidden' : 'block'} sm:block p-6`}>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={24} className="text-red-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => { setFile(null); setResult(null); }}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 border border-gray-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Convert Button */}
        <AnimatePresence>
          {file && !result && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConvert}
              disabled={isProcessing}
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
                  <span>Converting to JPG...</span>
                </>
              ) : (
                <>
                  <ImageIcon size={20} className="group-hover:scale-110 transition-transform" />
                  <span>Convert to JPG</span>
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
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
                    Conversion Complete
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <ImageIcon size={24} className="text-emerald-600" strokeWidth={2} />
                    </motion.div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">pdf-images.zip</p>
                      <p className="text-xs text-gray-500">All pages converted • Ready to download</p>
                    </div>
                  </div>
                </motion.div>
                <div className="space-y-3">
                  <motion.a
                    href={result.url}
                    download="pdf-images.zip"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Download size={18} className="group-hover:animate-bounce" />
                    Download Images (ZIP)
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
                    <ImageIcon size={18} />
                    Convert Another PDF
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {!file && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div className="inline-block mb-4">
                <ImageIcon size={48} className="text-gray-300" strokeWidth={1.5} />
              </motion.div>
              <p className="text-sm text-gray-500">Upload a PDF file to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
