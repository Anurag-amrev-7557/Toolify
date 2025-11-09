'use client'
import { useState } from 'react'
import { FileText, Upload, X, GripVertical, Download, Loader2, CheckCircle2, ArrowUpDown, Trash2, FileStack, Sparkles, Info } from 'lucide-react'
import { motion, Reorder, AnimatePresence } from 'framer-motion'
import { API_URL } from '../lib/config'

interface PDFMergeTemplateProps {
  toolName: string
  description: string
  onProcess: (files: File[]) => Promise<any>
}

interface PDFFile {
  id: string
  file: File
  name: string
  size: string
}

export default function PDFMergeTemplate({ toolName, description, onProcess }: PDFMergeTemplateProps) {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showInfo, setShowInfo] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    
    const pdfFiles = Array.from(newFiles).filter(f => f.type === 'application/pdf')
    const mapped = pdfFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size)
    }))
    
    setFiles(prev => [...prev, ...mapped])
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    setResult(null)
  }

  const reverseOrder = () => {
    setFiles(prev => [...prev].reverse())
  }

  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0)

  const handleMerge = async () => {
    if (files.length < 2) return
    
    setIsProcessing(true)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f.file))
      
      const response = await fetch(`${API_URL}/api/process/pdf-merger`, {
        method: 'POST',
        body: formData,
      })
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResult({ url })
    } catch (error) {
      console.error('Merge failed', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
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
                <FileText size={24} className="text-white" strokeWidth={2} />
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
          <p className="text-base text-gray-600 max-w-2xl">{description} • Drag to reorder • Secure & private</p>
          
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
                      <li>• Upload 2 or more PDF files</li>
                      <li>• Drag files to reorder them</li>
                      <li>• Click merge to combine into one PDF</li>
                      <li>• All processing happens securely in your browser</li>
                    </ul>
                  </div>
                </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Upload Area */}
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
              multiple
              accept=".pdf"
              onChange={(e) => handleFiles(e.target.files)}
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
                  {isDragging ? 'Drop your PDFs here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500">PDF files only • Multiple files supported</p>
              </div>
            </div>
          </label>
        </motion.div>

        {/* Files List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden mb-6"
            >
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Files to Merge ({files.length})
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Total size: {formatFileSize(totalSize)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={reverseOrder}
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 border border-gray-300"
                    >
                      <ArrowUpDown size={14} />
                      Reverse
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setFiles([]); setResult(null); }}
                      className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-300"
                    >
                      <Trash2 size={14} />
                      Clear
                    </motion.button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <GripVertical size={14} />
                  <span>Drag to reorder</span>
                </div>
              </div>
            
            <Reorder.Group axis="y" values={files} onReorder={setFiles} className="divide-y divide-gray-100">
              {files.map((pdfFile, index) => (
                <Reorder.Item key={pdfFile.id} value={pdfFile}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical size={20} className="text-gray-400" />
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-gray-600" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{pdfFile.name}</p>
                      <p className="text-xs text-gray-500">{pdfFile.size}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <button
                        onClick={() => removeFile(pdfFile.id)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <X size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Merge Button */}
        <AnimatePresence>
          {files.length >= 2 && !result && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMerge}
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
                  <span>Merging PDFs...</span>
                </>
              ) : (
                <>
                  <FileStack size={20} className="group-hover:rotate-12 transition-transform" />
                  <span>Merge {files.length} PDFs into One</span>
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
                    Merge Complete
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
                      <p className="text-sm font-semibold text-gray-900">merged.pdf</p>
                      <p className="text-xs text-gray-500">{files.length} files combined • Ready to download</p>
                    </div>
                  </div>
                </motion.div>
                <div className="space-y-3">
                  <motion.a
                    href={result.url}
                    download="merged.pdf"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Download size={18} />
                    Download Merged PDF
                  </motion.a>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setFiles([]); setResult(null); }}
                    className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <FileStack size={18} />
                    Merge More PDFs
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <AnimatePresence mode="wait">
          {files.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div
                className="inline-block mb-4"
              >
                <FileStack size={48} className="text-gray-300" strokeWidth={1.5} />
              </motion.div>
              <p className="text-sm text-gray-500">Upload at least 2 PDF files to get started</p>
            </motion.div>
          )}
          {files.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-6 bg-amber-50 border border-amber-200 rounded-xl"
            >
              <p className="text-sm text-amber-900 font-medium">📄 Add at least one more PDF to merge</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
