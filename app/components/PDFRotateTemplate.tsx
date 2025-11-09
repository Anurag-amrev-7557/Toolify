'use client'
import { useState } from 'react'
import { FileText, Upload, X, Download, Loader2, CheckCircle2, RotateCw, Sparkles, Info, ArrowUpDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../lib/config'

interface PDFRotateTemplateProps {
  toolName: string
  description: string
}

export default function PDFRotateTemplate({ toolName, description }: PDFRotateTemplateProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [angle, setAngle] = useState(90)
  // customAngle slider removed; only presets supported now
  const [showInfo, setShowInfo] = useState(false)
  const [previewCollapsed, setPreviewCollapsed] = useState<boolean>(false)
  const [applyToAllPages, setApplyToAllPages] = useState(true)
  const [pageRange, setPageRange] = useState('')

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFile = (newFile: File | null) => {
    if (!newFile || newFile.type !== 'application/pdf') return
    setFile(newFile)
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }

  const handleRotate = async () => {
    if (!file) return
    
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('angle', angle.toString())
      
      const response = await fetch(`${API_URL}/api/process/pdf-rotate`, {
        method: 'POST',
        body: formData,
      })
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResult({ url })
    } catch (error) {
      console.error('Rotation failed', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center"
                whileHover={{ rotate: 90, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <RotateCw size={24} className="text-white" strokeWidth={2} />
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
                        <li>• Upload a PDF file</li>
                        <li>• Select rotation angle (90°, 180°, or 270°)</li>
                        <li>• Choose pages to rotate</li>
                        <li>• All processing happens securely</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                  onChange={(e) => handleFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                    isDragging ? 'border-gray-900 bg-gray-900' : 'border-gray-400 bg-transparent'
                  }`}>
                    <Upload size={28} className={isDragging ? 'text-white' : 'text-gray-600'} strokeWidth={2} />
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

            {file && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex-1 flex flex-col"
              >
                <div className="border-b border-gray-200 px-6 py-4 bg-white">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Selected File</h2>
                </div>
                <div className={`${previewCollapsed ? 'hidden' : 'block'} sm:block p-6`}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FileText size={20} className="text-gray-600" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setFile(null); setResult(null); }}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {!file && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex-1 flex items-center justify-center"
              >
                <div className="text-center py-12">
                  <motion.div className="inline-block mb-4">
                    <RotateCw size={48} className="text-gray-300" strokeWidth={1.5} />
                  </motion.div>
                  <p className="text-sm text-gray-500">Upload a PDF file to get started</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col">
            {!result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex-1 flex flex-col"
              >
                <div className="border-b border-gray-200 px-6 py-4 bg-white">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Rotation Settings</h2>
                </div>
                <div className="p-6 space-y-6 flex-1 flex flex-col">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 block">Rotation Angle</label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {[90, 180, 270].map((deg) => (
                        <motion.button
                          key={deg}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAngle(deg)}
                          className={`py-4 rounded-xl font-semibold transition-all border-2 ${
                            angle === deg
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                          }`}
                        >
                          {deg}°
                        </motion.button>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">Selected: {angle}°</div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 block">Apply To</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex flex-col gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all hover:border-gray-400 ${
                        applyToAllPages ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={applyToAllPages}
                            onChange={() => setApplyToAllPages(true)}
                            className="w-4 h-4"
                          />
                          <p className="text-sm font-medium text-gray-900">All Pages</p>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">Rotate every page</p>
                      </label>
                      <label className={`flex flex-col gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all hover:border-gray-400 ${
                        !applyToAllPages ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={!applyToAllPages}
                            onChange={() => setApplyToAllPages(false)}
                            className="w-4 h-4"
                          />
                          <p className="text-sm font-medium text-gray-900">Specific Pages</p>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">Select pages</p>
                      </label>
                    </div>
                    {!applyToAllPages && (
                      <input
                        type="text"
                        value={pageRange}
                        onChange={(e) => setPageRange(e.target.value)}
                        placeholder="e.g., 1,3,5-7"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 mt-3"
                      />
                    )}
                  </div>

                  <div className="flex-1" />
                  {file && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRotate}
                      disabled={isProcessing}
                      className="relative w-full py-5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group mt-auto"
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
                          <span>Rotating PDF...</span>
                        </>
                      ) : (
                        <>
                          <RotateCw size={20} className="group-hover:rotate-90 transition-transform" />
                          <span>Rotate PDF by {angle}°</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : (
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
                      Rotation Complete
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <motion.a
                      href={result.url}
                      download="rotated.pdf"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Download size={18} />
                      Download Rotated PDF
                    </motion.a>
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setFile(null); setResult(null); }}
                      className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCw size={18} />
                      Rotate Another PDF
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
