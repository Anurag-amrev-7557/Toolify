'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Download, CheckCircle2, Loader2, Hash, FileText, X, Info, Sparkles } from 'lucide-react'

interface PDFPageNumbersTemplateProps {
  title: string
  description: string
  endpoint: string
}

export default function PDFPageNumbersTemplate({ title, description, endpoint }: PDFPageNumbersTemplateProps) {
  const [file, setFile] = useState<File | null>(null)
  const [position, setPosition] = useState('bottom-center')
  const [startNumber, setStartNumber] = useState(1)
  const [fontSize, setFontSize] = useState(12)
  const [format, setFormat] = useState('Page {n}')
  const [color, setColor] = useState('#000000')
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

  const handleAddNumbers = async () => {
    if (!file) return

    setIsProcessing(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('position', position)
    formData.append('startNumber', startNumber.toString())
    formData.append('fontSize', fontSize.toString())
    formData.append('format', format)
    formData.append('color', color)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Failed to add page numbers')
        return
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResult({ url })
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add page numbers')
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
                <Hash size={20} className="sm:hidden text-white" strokeWidth={2} />
                <Hash size={24} className="hidden sm:block text-white" strokeWidth={2} />
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
                        <li>• Upload a PDF file</li>
                        <li>• Choose position and starting number</li>
                        <li>• Download PDF with page numbers</li>
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
                      onClick={() => { setFile(null); setResult(null); }}
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
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Settings</h2>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  {/* two-column grid inside settings for larger screens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">
                        Position
                      </label>
                      <div className="grid grid-cols-3 gap-2 border border-gray-100 rounded-lg p-2 bg-gray-50">
                        {[
                          ['top-left',''], ['top-center',''], ['top-right',''],
                          ['bottom-left',''], ['bottom-center',''], ['bottom-right','']
                        ].map(([val]) => (
                          <button
                            key={val}
                            aria-label={`Position ${val}`}
                            onClick={() => setPosition(val as string)}
                            className={`h-10 rounded-md text-xs font-medium text-gray-700 border ${position===val ? 'bg-gray-900 text-white border-transparent' : 'bg-white border-gray-200'} flex items-center justify-center transition-all`}
                          >
                            {String(val).replace('-', ' ').replace('center','center')}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Tap to choose where numbers appear on the page</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Start Number</label>
                      <input
                        type="number"
                        value={startNumber}
                        onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Format</label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="Page {n}">Page {`{n}`}</option>
                        <option value="{n}">{`{n}`}</option>
                        <option value="- {n} -">- {`{n}`} -</option>
                        <option value="[{n}]">[{`{n}`} ]</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Font Size</label>
                      <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                        min="8"
                        max="48"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-16 h-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
                          aria-label="Number color"
                        />
                        <div className="text-sm text-gray-600">Selected color: <span className="font-medium text-gray-900">{color.toUpperCase()}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* live preview and call to action */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 h-36 relative flex items-center justify-center">
                      {/* preview box */}
                      <div className="w-full h-full bg-white border border-gray-200 rounded-md relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-300">PDF preview</div>
                        <div
                          className="absolute"
                          style={(function(){
                            const base: any = { color, fontSize: `${fontSize}px`, fontWeight: 600 };
                            // position mapping
                            const map: any = {
                              'top-left': { top: 8, left: 8 },
                              'top-center': { top: 8, left: '50%', transform: 'translateX(-50%)' },
                              'top-right': { top: 8, right: 8 },
                              'bottom-left': { bottom: 8, left: 8 },
                              'bottom-center': { bottom: 8, left: '50%', transform: 'translateX(-50%)' },
                              'bottom-right': { bottom: 8, right: 8 },
                            };
                            return { ...(map[position] || map['bottom-center']), ...base };
                          })()}
                        >
                          {format.replace('{n}', String(startNumber))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="text-sm text-gray-600">Preview shows current format, color and size at chosen position.</div>
                      <div className="flex-1" />
                      {file && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddNumbers}
                          disabled={isProcessing}
                          className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              <span>Adding Numbers...</span>
                            </>
                          ) : (
                            <>
                              <Hash size={20} />
                              <span>Add Page Numbers</span>
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
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
                    <h2 className="text-sm font-semibold text-emerald-900 uppercase tracking-wide">Numbers Added</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <motion.a
                      href={result.url}
                      download="numbered.pdf"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download Numbered PDF
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setFile(null); setResult(null); }}
                      className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Hash size={18} />
                      Number Another PDF
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
