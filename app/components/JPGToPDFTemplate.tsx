'use client'
import { useState } from 'react'
import { FileText, Upload, Download, Loader2, CheckCircle2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../lib/config'

export default function JPGToPDFTemplate({ toolName, description }: any) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    const imageFiles = Array.from(newFiles).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...imageFiles])
  }

  const handleConvert = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      const response = await fetch(`${API_URL}/api/process/jpg-to-pdf`, {
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
              <FileText size={24} className="text-white" strokeWidth={2} />
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
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }}
          className={`bg-white rounded-2xl border-2 border-dashed transition-all mb-6 ${isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
        >
          <label className="block p-12 cursor-pointer">
            <input type="file" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} className="hidden" />
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${isDragging ? 'border-gray-900 bg-gray-900' : 'border-gray-400'}`}>
                <Upload size={28} className={isDragging ? 'text-white' : 'text-gray-600'} />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">Image files • Multiple files supported</p>
              </div>
            </div>
          </label>
        </motion.div>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden mb-6">
              <div className="border-b border-gray-200 px-6 py-4 bg-white flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Selected Images ({files.length})</h2>
                <button onClick={() => setFiles([])} className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-300">Clear All</button>
              </div>
              <div className="p-6 grid grid-cols-3 gap-4">
                {files.map((file, i) => (
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-32 object-cover rounded-lg" />
                    <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {files.length > 0 && !result && (
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }} onClick={handleConvert} disabled={isProcessing} className="w-full py-5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? <><Loader2 size={20} className="animate-spin" /><span>Converting...</span></> : <><FileText size={20} /><span>Convert to PDF</span></>}
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-emerald-300 shadow-lg overflow-hidden">
              <div className="border-b border-emerald-200 px-6 py-4 bg-emerald-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                  <h2 className="text-sm font-semibold text-emerald-900">Conversion Complete</h2>
                </div>
              </div>
              <div className="p-6">
                <motion.a href={result.url} download="images-to-pdf.pdf" whileHover={{ scale: 1.02 }} className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                  <Download size={18} />Download PDF
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
