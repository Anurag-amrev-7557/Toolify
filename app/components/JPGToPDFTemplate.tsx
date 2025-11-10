'use client'
import { useState, useEffect } from 'react'
import { FileText, Upload, Download, Loader2, CheckCircle2, X, GripVertical } from 'lucide-react'
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion'
import { API_URL } from '../lib/config'

interface ImageFile {
  id: string
  file: File
  name: string
  size: string
  preview: string
}

export default function JPGToPDFTemplate({ toolName, description }: any) {
  const [files, setFiles] = useState<ImageFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    const imageFiles = Array.from(newFiles).filter(f => f.type.startsWith('image/'))
    const mapped = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      preview: URL.createObjectURL(file)
    }))
    setFiles(prev => [...prev, ...mapped])
  }

  const handleConvert = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f.file))
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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const removeFile = (id: string) => {
    setFiles(prev => {
      const f = prev.find(p => p.id === id)
      if (f) URL.revokeObjectURL(f.preview)
      return prev.filter(p => p.id !== id)
    })
  }

  // Small subcomponent for mobile reorder items that uses a dedicated drag handle.
  function MobileReorderItem({ file, index, removeFile }: { file: ImageFile, index: number, removeFile: (id: string) => void }) {
    const controls = useDragControls()
    return (
      <Reorder.Item value={file} layout>
        <motion.div
          layout
          whileDrag={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
          transition={{ layout: { type: 'spring', stiffness: 500, damping: 40 }, default: { type: 'spring', stiffness: 600, damping: 40 } as any }}
          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg cursor-grab active:cursor-grabbing"
        >
          <div
            className="p-2 rounded-md touch-manipulation"
            onPointerDown={(e: any) => controls.start(e)}
            onMouseDown={(e: any) => controls.start(e as any)}
            onTouchStart={(e: any) => controls.start(e as any)}
            style={{ touchAction: 'none' }}
            aria-hidden
          >
            <GripVertical size={18} className="text-gray-400" />
          </div>
          <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
            <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{file.size}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">#{index+1}</span>
            <button onClick={() => removeFile(file.id)} className="p-1.5 hover:bg-gray-200 rounded-lg">
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        </motion.div>
      </Reorder.Item>
    )
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
              <div className="border-b border-gray-200 px-6 py-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900">Selected Images ({files.length})</h2>
                  <button onClick={() => { files.forEach(f => URL.revokeObjectURL(f.preview)); setFiles([]) }} className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-300">Clear All</button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <GripVertical size={14} />
                  <span>Drag to reorder</span>
                </div>
              </div>
              <div className="p-6">
                {isMobile ? (
                  // Use per-item drag controls so the GripVertical acts as the real handle on touch devices
                  <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-3">
                    {files.map((file, i) => (
                      <MobileReorderItem key={file.id} file={file} index={i} removeFile={removeFile} />
                    ))}
                  </Reorder.Group>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {files.map((file, i) => (
                      <div key={file.id} className="relative group">
                        {/* visible grip so users discover drag-to-reorder */}
                        <div className="absolute left-2 top-2 z-10 bg-white/80 rounded-md p-1">
                          <GripVertical size={16} className="text-gray-600" />
                        </div>
                        <img src={file.preview} alt={file.name} className="w-full h-32 object-cover rounded-lg" />
                        <button onClick={() => removeFile(file.id)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} />
                        </button>
                        <div className="absolute left-2 bottom-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">#{i+1}</div>
                      </div>
                    ))}
                  </div>
                )}
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
