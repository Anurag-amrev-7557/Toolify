'use client'
import { useState } from 'react'
import { Image as ImageIcon, Upload, Download, Loader2, CheckCircle2, Sparkles, Info, Minimize2, ArrowDownCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../lib/config'

interface ImageCompressorTemplateProps {
  toolName: string
  description: string
  onProcess: (file: File, options: any) => Promise<any>
}

export default function ImageCompressorTemplate({ toolName, description, onProcess }: ImageCompressorTemplateProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [quality, setQuality] = useState(80)
  const [format, setFormat] = useState<'original' | 'jpg' | 'png' | 'webp'>('original')
  const [maxWidth, setMaxWidth] = useState<number>(0)
  const [maxHeight, setMaxHeight] = useState<number>(0)
  const [maintainAspect, setMaintainAspect] = useState(true)
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type.startsWith('image/')) {
      setFile(droppedFile)
      const url = URL.createObjectURL(droppedFile)
      setPreview(url)
      setResult(null)
      
      // Get image dimensions
      const img = new Image()
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height })
      }
      img.src = url
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreview(url)
      setResult(null)
      
      // Get image dimensions
      const img = new Image()
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height })
      }
      img.src = url
    }
  }

  const handleCompress = async () => {
    if (!file) return
    
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('quality', quality.toString())
      formData.append('format', format)
      if (maxWidth > 0) formData.append('maxWidth', maxWidth.toString())
      if (maxHeight > 0) formData.append('maxHeight', maxHeight.toString())
      formData.append('maintainAspect', maintainAspect.toString())
      
      const response = await fetch(`${API_URL}/api/process/image-compressor`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) throw new Error('Compression failed')
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const originalSize = file.size
      const compressedSize = blob.size
      const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1)
      
      setResult({ url, originalSize, compressedSize, savings })
    } catch (error: any) {
      console.error('Compression failed', error)
      alert('Compression failed. Please restart the backend server after installing Pillow (pip3 install Pillow).')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Calculate estimated output dimensions
  const getOutputDimensions = () => {
    if (!imageDimensions) return null
    
    let width = imageDimensions.width
    let height = imageDimensions.height
    
    if (maxWidth > 0 || maxHeight > 0) {
      if (maintainAspect) {
        const aspectRatio = width / height
        if (maxWidth > 0 && maxHeight > 0) {
          if (width / maxWidth > height / maxHeight) {
            width = maxWidth
            height = Math.round(maxWidth / aspectRatio)
          } else {
            height = maxHeight
            width = Math.round(maxHeight * aspectRatio)
          }
        } else if (maxWidth > 0) {
          width = maxWidth
          height = Math.round(maxWidth / aspectRatio)
        } else if (maxHeight > 0) {
          height = maxHeight
          width = Math.round(maxHeight * aspectRatio)
        }
      } else {
        if (maxWidth > 0) width = maxWidth
        if (maxHeight > 0) height = maxHeight
      }
    }
    
    return { width, height }
  }

  // Estimate output file size
  const getEstimatedSize = () => {
    if (!file) return null
    
    const outputDims = getOutputDimensions()
    if (!outputDims || !imageDimensions) return null
    
    const pixelReduction = (outputDims.width * outputDims.height) / (imageDimensions.width * imageDimensions.height)
    const qualityFactor = quality / 100
    const formatFactor = format === 'webp' ? 0.7 : format === 'jpg' ? 0.8 : 1.0
    
    return file.size * pixelReduction * qualityFactor * formatFactor
  }

  const outputDimensions = getOutputDimensions()
  const estimatedSize = getEstimatedSize()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
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
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ImageIcon size={24} className="text-white" strokeWidth={2} />
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
          <p className="text-base text-gray-600 max-w-2xl">{description} • Adjustable quality • Instant preview</p>
          
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
                        <li>• Upload any image (JPG, PNG, WebP)</li>
                        <li>• Adjust quality and format</li>
                        <li>• Resize images with custom dimensions</li>
                        <li>• Download optimized image instantly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Two Column Layout */}
        {!file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`bg-white rounded-2xl border-2 border-dashed transition-all duration-200 ${
              isDragging ? 'border-gray-900 bg-gray-50 scale-[1.02]' : 'border-gray-300'
            }`}
          >
            <label className="block p-12 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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
                    {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500">JPG, PNG, WebP • Max 10MB</p>
                </div>
              </div>
            </label>
          </motion.div>
        )}

        <AnimatePresence>
          {file && !result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column - Preview (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4 bg-white">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Image Preview</h2>
                  </div>
                  <div className="p-6">
                    <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                      <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">Original: {formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={() => { setFile(null); setPreview(''); setImageDimensions(null); }}
                          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 border border-gray-300 ml-4"
                        >
                          Remove
                        </button>
                      </div>
                      
                      {/* Live Preview Stats */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Dimensions</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {imageDimensions ? `${imageDimensions.width} × ${imageDimensions.height}` : 'Loading...'}
                          </p>
                          {outputDimensions && (outputDimensions.width !== imageDimensions?.width || outputDimensions.height !== imageDimensions?.height) && (
                            <p className="text-xs text-blue-600 mt-1">
                              → {outputDimensions.width} × {outputDimensions.height}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Est. Output</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {estimatedSize ? formatFileSize(estimatedSize) : formatFileSize(file.size)}
                          </p>
                          {estimatedSize && (
                            <p className="text-xs text-emerald-600 mt-1">
                              ~{((1 - estimatedSize / file.size) * 100).toFixed(0)}% smaller
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Controls (1 col) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full flex flex-col">
                  <div className="border-b border-gray-200 px-6 py-4 bg-white">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Settings</h2>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Quality */}
                        <div className="col-span-2">
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Quality
                            </label>
                            <span className="text-xl font-semibold text-gray-900 dark:text-white tabular-nums">
                              {quality}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-900 accent-gray-900 dark:accent-white"
                          />
                          <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>Smaller</span>
                            <span>Better</span>
                          </div>
                        </div>
                      {/* Format */}
                      <div className="col-span-2 pt-4 border-t border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Format</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'original', label: 'Original' },
                            { value: 'jpg', label: 'JPG' },
                            { value: 'png', label: 'PNG' },
                            { value: 'webp', label: 'WebP' }
                          ].map((fmt) => (
                            <motion.button
                              key={fmt.value}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFormat(fmt.value as any)}
                              className={`py-3 px-3 rounded-full text-xs font-semibold transition-all ${
                                format === fmt.value
                                  ? 'bg-gray-900 text-white dark:text-black'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {fmt.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Resize */}
                      <div className="col-span-2 pt-4 border-t border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Resize</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">Width (px)</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="Auto"
                              value={maxWidth || ''}
                              onChange={(e) => setMaxWidth(parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">Height (px)</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="Auto"
                              value={maxHeight || ''}
                              onChange={(e) => setMaxHeight(parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-gray-900"
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer mt-3">
                          <input
                            type="checkbox"
                            checked={maintainAspect}
                            onChange={(e) => setMaintainAspect(e.target.checked)}
                            className="w-4 h-4 accent-gray-900 cursor-pointer"
                          />
                          <span className="text-xs font-medium text-gray-700">Maintain aspect ratio</span>
                        </label>
                      </div>

                    </div>
                  </div>
                  
                  {/* Compress Button at Bottom */}
                  <div className="p-6 pt-0">
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCompress}
                      disabled={isProcessing}
                      className="relative w-full py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group"
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
                          <span>Compressing...</span>
                        </>
                      ) : (
                        <>
                          <Minimize2 size={20} className="group-hover:scale-90 transition-transform" />
                          <span>Compress</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result - Full Width */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                    Compression Complete
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {/* Stats */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-3 gap-4 mb-6"
                >
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-xs text-gray-500 mb-1">Original</p>
                    <p className="text-lg font-bold text-gray-900">{formatFileSize(result.originalSize)}</p>
                    {result.originalDimensions && (
                      <p className="text-xs text-gray-500 mt-1">{result.originalDimensions}</p>
                    )}
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl text-center">
                    <ArrowDownCircle size={20} className="text-emerald-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-600">{result.savings}%</p>
                    <p className="text-xs text-emerald-700 mt-1">Saved</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-xs text-gray-500 mb-1">Compressed</p>
                    <p className="text-lg font-bold text-gray-900">{formatFileSize(result.compressedSize)}</p>
                    {result.newDimensions && (
                      <p className="text-xs text-gray-500 mt-1">{result.newDimensions}</p>
                    )}
                  </div>
                </motion.div>

                {/* Actions */}
                <div className="space-y-3">
                  <motion.a
                    href={result.url}
                    download={`compressed-${file?.name}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Download size={18} className="group-hover:animate-bounce" />
                    Download Compressed Image
                  </motion.a>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setFile(null); setPreview(''); setResult(null); }}
                    className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ImageIcon size={18} />
                    Compress Another Image
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
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block mb-4"
              >
                <ImageIcon size={48} className="text-gray-300" strokeWidth={1.5} />
              </motion.div>
              <p className="text-sm text-gray-500">Upload an image to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
