'use client'
import { useState } from 'react'
import { Upload, Download, Loader2, CheckCircle2, LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../lib/config'

interface PDFToolTemplateProps {
  toolName: string
  description: string
  icon: LucideIcon
  endpoint: string
  buttonText: string
  processingText: string
  downloadName: string
  options?: React.ReactNode
  extraFormData?: (file: File) => Record<string, string>
  acceptedFormats?: string
  fileTypeLabel?: string
}

export default function PDFToolTemplate({ 
  toolName, 
  description, 
  icon: Icon, 
  endpoint, 
  buttonText, 
  processingText, 
  downloadName,
  options,
  extraFormData,
  acceptedFormats = '.pdf',
  fileTypeLabel = 'PDF file only'
}: PDFToolTemplateProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleProcess = async () => {
    if (!file) return
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (extraFormData) {
        const extra = extraFormData(file)
        Object.entries(extra).forEach(([key, value]) => formData.append(key, value))
      }
      const response = await fetch(`${API_URL}/api/process/${endpoint}`, {
        method: 'POST',
        body: formData,
      })
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResult({ url })
    } catch (error) {
      console.error('Process failed', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
              <Icon size={24} className="text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{toolName}</h1>
          </div>
          <p className="text-base text-gray-600">{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { 
            e.preventDefault()
            setIsDragging(false)
            const droppedFile = e.dataTransfer.files[0]
            const isValidFile = acceptedFormats === '.pdf' 
              ? droppedFile?.type === 'application/pdf'
              : acceptedFormats.includes('.doc') || acceptedFormats.includes('.docx')
                ? droppedFile?.type.includes('word') || droppedFile?.name.endsWith('.doc') || droppedFile?.name.endsWith('.docx')
                : acceptedFormats.includes('.xls') || acceptedFormats.includes('.xlsx')
                  ? droppedFile?.type.includes('sheet') || droppedFile?.name.endsWith('.xls') || droppedFile?.name.endsWith('.xlsx')
                  : acceptedFormats.includes('.ppt') || acceptedFormats.includes('.pptx')
                    ? droppedFile?.type.includes('presentation') || droppedFile?.name.endsWith('.ppt') || droppedFile?.name.endsWith('.pptx')
                    : true
            if (isValidFile) setFile(droppedFile)
          }}
          className={`bg-white rounded-2xl border-2 border-dashed transition-all mb-6 ${
            isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
          }`}
        >
          <label className="block p-12 cursor-pointer">
            <input type="file" accept={acceptedFormats} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${
                isDragging ? 'border-gray-900 bg-gray-900' : 'border-gray-400'
              }`}>
                <Upload size={28} className={isDragging ? 'text-white dark:text-gray-600' : 'text-gray-600'} />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">{fileTypeLabel}</p>
              </div>
            </div>
          </label>
        </motion.div>

        {options && file && !result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6 mb-6">
            {options}
          </motion.div>
        )}

        <AnimatePresence>
          {file && !result && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full py-5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <><Loader2 size={20} className="animate-spin" /><span>{processingText}</span></>
              ) : (
                <><Icon size={20} /><span>{buttonText}</span></>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-emerald-300 shadow-lg overflow-hidden">
              <div className="border-b border-emerald-200 px-6 py-4 bg-emerald-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                  <h2 className="text-sm font-semibold text-emerald-900">Process Complete</h2>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <motion.a
                  href={result.url}
                  download={downloadName}
                  whileHover={{ scale: 1.02 }}
                  className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} />Download PDF
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => { setFile(null); setResult(null) }}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all"
                >
                  Process Another PDF
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
