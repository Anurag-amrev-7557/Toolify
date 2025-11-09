'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Download, CheckCircle2, Loader2, ArrowUpDown, FileText, X, Info, Sparkles, GripVertical } from 'lucide-react'

interface PDFOrganizeTemplateProps {
  title: string
  description: string
  endpoint: string
}

export default function PDFOrganizeTemplate({ title, description, endpoint }: PDFOrganizeTemplateProps) {
  const [file, setFile] = useState<File | null>(null)
  const [pageOrder, setPageOrder] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ url: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setResult(null)
      const pages = Array.from({ length: 10 }, (_, i) => i + 1)
      setPageOrder(pages)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile)
      setResult(null)
      const pages = Array.from({ length: 10 }, (_, i) => i + 1)
      setPageOrder(pages)
    }
  }

  const movePage = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...pageOrder]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]]
      setPageOrder(newOrder)
    }
  }

  const handleOrganize = async () => {
    if (!file) return

    setIsProcessing(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('order', pageOrder.join(','))

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResult({ url })
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to organize PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="mb-6 sm:mb-12">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                <ArrowUpDown size={20} className="sm:hidden text-white" strokeWidth={2} />
                <ArrowUpDown size={24} className="hidden sm:block text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-lg border border-gray-300 hover:border-gray-900 transition-colors"
            >
              <Info size={20} className="text-gray-600" />
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">{description} • Drag to reorder</p>

          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">How it works:</p>
                      <ul className="space-y-1 text-blue-800">
                        <li>• Upload a PDF file</li>
                        <li>• Reorder pages using arrows</li>
                        <li>• Download organized PDF</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`bg-white rounded-2xl border-2 border-dashed transition-all duration-200 mb-6 ${
                isDragging ? 'border-gray-900 bg-gray-50 scale-[1.02]' : 'border-gray-300'
              }`}
            >
              <label className="block p-8 sm:p-12 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                    isDragging ? 'border-gray-900 bg-gray-900' : 'border-gray-400 bg-transparent'
                  }`}>
                    <Upload size={24} className="sm:hidden" strokeWidth={2} />
                    <Upload size={28} className="hidden sm:block" strokeWidth={2} />
                  </div>
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                      {isDragging ? 'Drop your PDF here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500">PDF files only</p>
                  </div>
                </div>
              </label>
            </div>

            {file && (
              <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 bg-white">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Selected File</h2>
                </div>
                <div className="p-6">
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
                      onClick={() => { setFile(null); setResult(null); setPageOrder([]); }}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {!result ? (
              <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="border-b border-gray-200 px-6 py-4 bg-white">
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Page Order</h2>
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col overflow-y-auto max-h-[500px]">
                  {pageOrder.length > 0 ? (
                    pageOrder.map((page, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <GripVertical size={16} className="text-gray-400" />
                        <span className="flex-1 text-sm font-medium">Page {page}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => movePage(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => movePage(index, 'down')}
                            disabled={index === pageOrder.length - 1}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">Upload a PDF to reorder pages</div>
                  )}
                  {file && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleOrganize}
                      disabled={isProcessing}
                      className="w-full py-5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Organizing...</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpDown size={20} />
                          <span>Organize PDF</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-emerald-300 shadow-lg overflow-hidden"
              >
                <div className="border-b border-emerald-200 px-6 py-4 bg-emerald-50">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-600" />
                    <h2 className="text-sm font-semibold text-emerald-900 uppercase tracking-wide">PDF Organized</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <motion.a
                      href={result.url}
                      download="organized.pdf"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download Organized PDF
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setFile(null); setResult(null); setPageOrder([]); }}
                      className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowUpDown size={18} />
                      Organize Another PDF
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
