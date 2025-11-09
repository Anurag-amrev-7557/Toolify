'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Loader2, FileText, X, Info, Sparkles, Eye } from 'lucide-react'

interface PDFOCRTemplateProps {
  title: string
  description: string
  endpoint: string
}

export default function PDFOCRTemplate({ title, description, endpoint }: PDFOCRTemplateProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ text: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile)
      setResult(null)
    }
  }

  const handleOCR = async () => {
    if (!file) return

    setIsProcessing(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.error) {
        alert(data.error)
      } else {
        setResult({ text: data.text })
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to extract text')
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
                <Eye size={20} className="sm:hidden text-white" strokeWidth={2} />
                <Eye size={24} className="hidden sm:block text-white" strokeWidth={2} />
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
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">{description}</p>

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
                        <li>• Upload a scanned PDF</li>
                        <li>• OCR extracts text from images</li>
                        <li>• Copy or download extracted text</li>
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
              <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex-1 flex flex-col">
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
                      onClick={() => { setFile(null); setResult(null); }}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOCR}
                    disabled={isProcessing}
                    className="w-full mt-4 py-5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Extracting Text...</span>
                      </>
                    ) : (
                      <>
                        <Eye size={20} />
                        <span>Extract Text</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden flex-1 flex flex-col">
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Extracted Text</h2>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                {result ? (
                  <textarea
                    value={result.text}
                    readOnly
                    className="w-full flex-1 min-h-[300px] sm:min-h-[400px] px-3 sm:px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none font-mono text-xs sm:text-sm resize-none"
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    {file ? 'Click extract to get text from PDF' : 'Upload a PDF to extract text'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
