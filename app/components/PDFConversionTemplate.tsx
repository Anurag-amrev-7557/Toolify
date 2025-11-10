'use client'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Upload, Download, Loader2, CheckCircle2, FileText, Info, Sparkles, X, Eye, Plus, ArrowUpDown, GripVertical } from 'lucide-react'
import * as Icons from 'lucide-react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { API_URL } from '../lib/config'

interface PDFConversionTemplateProps {
  toolName: string
  description: string
  // Accept either an icon name (string) or a direct icon component
  iconName?: string
  icon?: any
  endpoint: string
  buttonText: string
  processingText: string
  downloadName: string
  acceptedFormats?: string
  fileTypeLabel?: string
  howItWorks: string[]
}

export default function PDFConversionTemplate({ 
  toolName, 
  description, 
  iconName,
  endpoint, 
  buttonText, 
  processingText, 
  downloadName,
  acceptedFormats = '.pdf',
  fileTypeLabel = 'PDF file only',
  howItWorks
}: PDFConversionTemplateProps) {
  const Icon = (iconName && (Icons as any)[iconName]) || FileText
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)
  // Splitter-specific state
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all')
  // default to valid values so client-side validation passes immediately
  const [startPage, setStartPage] = useState<number | ''>(1)
  const [endPage, setEndPage] = useState<number | ''>(1)
  // rotate-pdf specific state (angle only; page-range removed). Use number to allow custom angles.
  const [rotateAngle, setRotateAngle] = useState<number>(90)
  const [showInfo, setShowInfo] = useState(false)
  const [pdfPreview, setPdfPreview] = useState<string | null>(null)
  const [docxPreview, setDocxPreview] = useState<string | null>(null)
  // page numbers specific
  const [position, setPosition] = useState<string>('bottom-center')
  const [startNumber, setStartNumber] = useState<number>(1)
  const [fontSize, setFontSize] = useState<number>(12)
  const [formatStr, setFormatStr] = useState<string>('Page {n}')
  const [color, setColor] = useState<string>('#000000')
  // mobile: allow collapsing the file preview to save vertical space
  const [previewCollapsed, setPreviewCollapsed] = useState<boolean>(false)

  interface ImageFile {
    id: string
    file: File
    name: string
    size: string
    preview?: string | null
    progress?: number
    status?: 'processing' | 'done' | 'pending'
    // server-side temporary id after individual upload
    serverId?: string
    uploadProgress?: number
    uploadStatus?: 'pending' | 'uploading' | 'uploaded' | 'failed'
  }

  const [imageFiles, setImageFiles] = useState<ImageFile[]>([])
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const addInputRef = useRef<HTMLInputElement | null>(null)

  // refs & state for improved segmented control indicator
  const toggleContainerRef = useRef<HTMLDivElement | null>(null)
  const allBtnRef = useRef<HTMLButtonElement | null>(null)
  const rangeBtnRef = useRef<HTMLButtonElement | null>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  // measure indicator position & width
  useLayoutEffect(() => {
    const update = () => {
      const container = toggleContainerRef.current
      const allBtn = allBtnRef.current
      const rangeBtn = rangeBtnRef.current
      if (!container || !allBtn || !rangeBtn) return
      const cRect = container.getBoundingClientRect()
      const target = splitMode === 'all' ? allBtn.getBoundingClientRect() : rangeBtn.getBoundingClientRect()
      setIndicator({ left: target.left - cRect.left, width: target.width })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [splitMode])

  useEffect(() => {
    if (file) {
      if (file.type === 'application/pdf') {
        const url = URL.createObjectURL(file)
        setPdfPreview(url)
        // fetch page count from backend
        const fetchPages = async () => {
          try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('mode', 'count')
            const res = await fetch(`${API_URL}/api/process/pdf-splitter`, { method: 'POST', body: formData })
            if (res.ok) {
              const data = await res.json()
                if (data.pages) {
                setTotalPages(data.pages)
                // populate page order for tools that need it (organize)
                setPageOrder(Array.from({ length: data.pages }, (_, i) => i + 1))
                // if user hasn't provided explicit values (or they exceed pages), set sensible defaults
                setStartPage((prev) => {
                  const prevNum = typeof prev === 'string' && prev !== '' ? Number(prev) : Number(prev || 1)
                  if (prev === '' || prev == null) return 1
                  if (prevNum < 1) return 1
                  if (prevNum > data.pages) return 1
                  return prev
                })
                setEndPage((prev) => {
                  const prevNum = typeof prev === 'string' && prev !== '' ? Number(prev) : Number(prev || 1)
                  // default end to last page unless user already set a valid smaller number
                  if (prev === '' || prev == null) return data.pages
                  if (prevNum > data.pages) return data.pages
                  return prev
                })
              }
            }
          } catch (e) {
            // ignore
          }
        }
        fetchPages()
        return () => URL.revokeObjectURL(url)
      } else if (file.type.startsWith('image/')) {
        // single-image flow: create optimized preview for display
        const createPreview = async (f: File) => {
          try {
            const imgBitmap = await createImageBitmap(f)
            const maxW = 1200
            const scale = Math.min(1, maxW / imgBitmap.width)
            const canvas = document.createElement('canvas')
            canvas.width = Math.round(imgBitmap.width * scale)
            canvas.height = Math.round(imgBitmap.height * scale)
            const ctx = canvas.getContext('2d')
            if (ctx) ctx.drawImage(imgBitmap, 0, 0, canvas.width, canvas.height)
            const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res as any, 'image/jpeg', 0.8))
            if (blob) return URL.createObjectURL(blob)
          } catch (e) {
            return URL.createObjectURL(f)
          }
          return null
        }

        ;(async () => {
          const preview = await createPreview(file)
          if (preview) {
            setImageFiles([{ id: Math.random().toString(36).substr(2, 9), file, name: file.name, size: formatSize(file.size), preview }])
            setActiveImageIndex(0)
          }
        })()
        return () => {}
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        const loadDocx = async () => {
          const mammoth = await import('mammoth')
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          setDocxPreview(result.value)
        }
        loadDocx()
      }
    }
  }, [file])

  // splitter client validation state
  const [totalPages, setTotalPages] = useState<number | null>(null)
  const [splitError, setSplitError] = useState<string | null>(null)
  // organize-specific state
  const [pageOrder, setPageOrder] = useState<number[]>([])

  // pdf-to-jpg options
  const [imgFormat, setImgFormat] = useState<'jpg' | 'png'>('jpg')
  const [imgQuality, setImgQuality] = useState<number>(90)
  const [imgDpi, setImgDpi] = useState<number>(150)
  const [imgGrayscale, setImgGrayscale] = useState<boolean>(false)
  const [separateFiles, setSeparateFiles] = useState<boolean>(true)

  // jpg-to-pdf options (shown when converting images -> pdf)
  const [jpgPageSize, setJpgPageSize] = useState<'A4' | 'Letter'>('A4')
  const [jpgMarginMm, setJpgMarginMm] = useState<number>(10)
  const [jpgOrientation, setJpgOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [jpgImageFit, setJpgImageFit] = useState<'contain' | 'cover'>('contain')

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  // helper to create optimized preview for a File (used for multi-image uploads)
  const createOptimizedPreview = async (f: File) => {
    try {
      const imgBitmap = await createImageBitmap(f)
      const maxW = 1200
      const scale = Math.min(1, maxW / imgBitmap.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(imgBitmap.width * scale)
      canvas.height = Math.round(imgBitmap.height * scale)
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.drawImage(imgBitmap, 0, 0, canvas.width, canvas.height)
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res as any, 'image/jpeg', 0.8))
      if (blob) return URL.createObjectURL(blob)
    } catch (e) {
      return URL.createObjectURL(f)
    }
    return null
  }

  const hasImageFiles = endpoint === 'jpg-to-pdf' && imageFiles.length > 0
  const activePreviewUrl: string | undefined = hasImageFiles ? imageFiles[activeImageIndex]?.preview ?? undefined : undefined

  const clearImageFiles = () => {
    imageFiles.forEach(i => { try { if (i.preview) URL.revokeObjectURL(i.preview) } catch(e) {} })
    setImageFiles([])
    setActiveImageIndex(0)
    // also clear any page-order state when images/files are cleared
    setPageOrder([])
  }

  const movePage = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...pageOrder]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      ;[newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]]
      setPageOrder(newOrder)
    }
  }

  const isPdfPrimary = !!file && file.type === 'application/pdf'
  const primaryName = hasImageFiles ? (imageFiles[activeImageIndex]?.name || '') : (file?.name || '')
  const primarySize = hasImageFiles ? (imageFiles[activeImageIndex]?.size || '') : (file ? formatSize(file.size) : '')

  const handleInputFiles = async (fileList: FileList | null) => {
    if (!fileList) return
    // JPG -> PDF flow supports multiple image files
    if (endpoint === 'jpg-to-pdf') {
      const imgs = Array.from(fileList).filter(f => f.type.startsWith('image/'))
      if (imgs.length === 0) return

      // create placeholder entries so UI can show items and per-file progress
      const placeholders: ImageFile[] = imgs.map((f) => ({
        id: Math.random().toString(36).substr(2,9),
        file: f,
        name: f.name,
        size: formatSize(f.size),
        preview: undefined,
        progress: 0,
        status: 'processing'
      }))

      setImageFiles(prev => [...prev, ...placeholders])
      setFile(null)
      setResult(null)

      // generate optimized previews asynchronously and update each item's progress/status
      for (const ph of placeholders) {
        try {
          // optimistic progress
          setImageFiles(prev => prev.map(p => p.id === ph.id ? { ...p, progress: 10 } : p))
          const preview = await createOptimizedPreview(ph.file)
          const finalPreview = preview || URL.createObjectURL(ph.file)
          setImageFiles(prev => prev.map(p => p.id === ph.id ? { ...p, preview: finalPreview, progress: 100, status: 'done' } : p))
        } catch (e) {
          // on error, still provide a fallback preview and mark pending
          const fallback = URL.createObjectURL(ph.file)
          setImageFiles(prev => prev.map(p => p.id === ph.id ? { ...p, preview: fallback, progress: 100, status: 'done' } : p))
        }
      }
      return
    }

    // default single-file behavior
    setFile(fileList[0] || null)
    setResult(null)
  }

  const handleConvert = async () => {
    if (endpoint === 'jpg-to-pdf') {
      if (imageFiles.length === 0) return
    } else {
      if (!file) return
    }
    // client-side validation for splitter
    if (endpoint === 'pdf-splitter' && splitMode === 'range') {
      setSplitError(null)
      const s = Number(startPage)
      const e = Number(endPage)
      if (!s || !e) {
        setSplitError('Start and end pages must be provided')
        return
      }
      if (s < 1 || e < s) {
        setSplitError('Invalid page range: ensure start >= 1 and end >= start')
        return
      }
      if (totalPages && (s > totalPages || e > totalPages)) {
        setSplitError(`Page range exceeds total pages (${totalPages})`)
        return
      }
    }

  // rotate page-range removed: only angle is used for pdf-rotate

    setIsProcessing(true)
    try {
      // Special flow: upload files individually with progress and then assemble server-side.
      if (endpoint === 'jpg-to-pdf') {
        // helper to upload a single file and report progress via XHR
        const uploadSingle = (img: ImageFile, idx: number) => new Promise<{ fileId?: string, raw?: any }>((resolve, reject) => {
          try {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', `${API_URL}/api/process/${endpoint}`)
            // indicate temporary-part upload (server must support this convention)
            xhr.setRequestHeader('X-Temp-Upload', '1')
            xhr.upload.onprogress = (ev: ProgressEvent<EventTarget>) => {
              if (ev.lengthComputable) {
                const percent = Math.round((ev.loaded / ev.total) * 100)
                setImageFiles(prev => prev.map(p => p.id === img.id ? { ...p, uploadProgress: percent, uploadStatus: 'uploading' } : p))
              }
            }
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                // attempt to parse JSON response for a temporary id
                try {
                  const json = JSON.parse(xhr.responseText)
                  resolve({ fileId: json?.fileId || json?.id, raw: json })
                } catch (e) {
                  resolve({ raw: xhr.responseText })
                }
              } else {
                reject(new Error(`Upload failed: ${xhr.status}`))
              }
            }
            xhr.onerror = () => reject(new Error('Upload network error'))
            const fd = new FormData()
            fd.append('file', img.file)
            fd.append('index', String(idx))
            xhr.send(fd)
          } catch (err) {
            reject(err)
          }
        })

        const uploadedIds: (string | undefined)[] = []
        // upload files sequentially so server receives them in order and we can track per-file progress
        for (let i = 0; i < imageFiles.length; i++) {
          const img = imageFiles[i]
          // mark uploading
          setImageFiles(prev => prev.map(p => p.id === img.id ? { ...p, uploadStatus: 'uploading', uploadProgress: 0 } : p))
          try {
            const res = await uploadSingle(img, i)
            const fileId = (res && (res.fileId || (res.raw && res.raw.fileId))) || undefined
            uploadedIds.push(fileId)
            setImageFiles(prev => prev.map(p => p.id === img.id ? { ...p, uploadStatus: 'uploaded', uploadProgress: 100, serverId: fileId } : p))
          } catch (err) {
            // mark failure and abort
            setImageFiles(prev => prev.map(p => p.id === img.id ? { ...p, uploadStatus: 'failed' } : p))
            setSplitError('One or more uploads failed')
            setIsProcessing(false)
            return
          }
        }

        // If server returned ids for all files, call assemble endpoint
        const haveIds = uploadedIds.length === imageFiles.length && uploadedIds.every(id => !!id)
        if (haveIds) {
          const assembleForm = new FormData()
          uploadedIds.forEach(id => assembleForm.append('fileIds', id!))
          // include jpg->pdf options so server can assemble accordingly
          assembleForm.append('pageSize', jpgPageSize)
          assembleForm.append('marginMm', String(jpgMarginMm))
          assembleForm.append('orientation', jpgOrientation)
          assembleForm.append('imageFit', jpgImageFit)
          // include any extra options required by the server
          const resp = await fetch(`${API_URL}/api/process/${endpoint}`, { method: 'POST', body: assembleForm })
          if (!resp.ok) {
            try {
              const err = await resp.json()
              setSplitError(err?.error || 'Conversion failed')
            } catch (_) {
              setSplitError('Conversion failed')
            }
            return
          }
          const methodUsed = resp.headers.get('X-Conversion-Method')
          const blob = await resp.blob()
          const url = URL.createObjectURL(blob)
          setResult({ url, method: methodUsed })
          return
        }

        // fallback: server didn't return ids -> send a combined request (original behavior)
        const fallbackForm = new FormData()
        imageFiles.forEach(f => fallbackForm.append('files', f.file))
  // include jpg->pdf options for fallback combined upload
  fallbackForm.append('pageSize', jpgPageSize)
  fallbackForm.append('marginMm', String(jpgMarginMm))
  fallbackForm.append('orientation', jpgOrientation)
  fallbackForm.append('imageFit', jpgImageFit)
        const fallbackResp = await fetch(`${API_URL}/api/process/${endpoint}`, { method: 'POST', body: fallbackForm })
        if (!fallbackResp.ok) {
          try { const err = await fallbackResp.json(); setSplitError(err?.error || 'Conversion failed') } catch (_) { setSplitError('Conversion failed') }
          return
        }
        const methodUsed = fallbackResp.headers.get('X-Conversion-Method')
        const blob = await fallbackResp.blob()
        const url = URL.createObjectURL(blob)
        setResult({ url, method: methodUsed })
        return
      }
      // non jpg-to-pdf: regular single upload flow
      const formData = new FormData()
      formData.append('file', file!)
      // include organize order when applicable
      if (endpoint === 'pdf-organize') {
        formData.append('order', pageOrder.join(','))
      }
      // include splitter options when applicable
      if (endpoint === 'pdf-splitter') {
        formData.append('mode', splitMode)
        if (splitMode === 'range') {
          formData.append('start', String(startPage || '1'))
          formData.append('end', String(endPage || '1'))
        }
      }
      // include rotate options when applicable (tool key: pdf-rotate)
      if (endpoint === 'pdf-rotate') {
        formData.append('angle', String(rotateAngle))
      }
      // include page-number options
      if (endpoint === 'pdf-page-numbers') {
        formData.append('position', position)
        formData.append('startNumber', String(startNumber))
        formData.append('fontSize', String(fontSize))
        formData.append('format', formatStr)
        formData.append('color', color)
      }
      // include pdf-to-jpg options
      if (endpoint === 'pdf-to-jpg') {
        formData.append('format', imgFormat)
        formData.append('quality', String(imgQuality))
        formData.append('dpi', String(imgDpi))
        formData.append('grayscale', imgGrayscale ? '1' : '0')
        formData.append('separate', separateFiles ? '1' : '0')
      }
      const response = await fetch(`${API_URL}/api/process/${endpoint}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        // try to parse backend error
        try {
          const err = await response.json()
          if (err?.error) setSplitError(err.error)
          else setSplitError('Conversion failed')
        } catch (_) {
          setSplitError('Conversion failed')
        }
        return
      }

      const methodUsed = response.headers.get('X-Conversion-Method')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setResult({ url, method: methodUsed })
    } catch (error) {
      console.error('Convert failed', error)
      setSplitError('Conversion failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const isSplitterRangeInvalid = () => {
    if (endpoint !== 'pdf-splitter' || splitMode !== 'range') return false
    const s = Number(startPage)
    const e = Number(endPage)
    if (!s || !e) return true
    if (s < 1 || e < s) return true
    if (totalPages && (s > totalPages || e > totalPages)) return true
    return false
  }

  

  // Helpers for improved inputs: clamping, increments and change handlers
  const clampToPages = (n: number) => {
    if (!n || n < 1) return 1
    if (totalPages) return Math.min(Math.max(1, n), totalPages)
    return n
  }

  const handleStartChange = (value: string) => {
    if (value === '') {
      setStartPage('')
      setSplitError(null)
      return
    }
    const num = Number(value)
    if (Number.isNaN(num)) return
    setStartPage(num)
    setSplitError(null)
  }

  const handleEndChange = (value: string) => {
    if (value === '') {
      setEndPage('')
      setSplitError(null)
      return
    }
    const num = Number(value)
    if (Number.isNaN(num)) return
    setEndPage(num)
    setSplitError(null)
  }

  const adjustStart = (delta: number) => {
    const cur = Number(startPage) || 1
    const next = clampToPages(cur + delta)
    setStartPage(next)
    setSplitError(null)
  }

  const adjustEnd = (delta: number) => {
    const cur = Number(endPage) || 1
    const next = clampToPages(cur + delta)
    setEndPage(next)
    setSplitError(null)
  }

  // rotate page-range helpers removed; only angle is supported now

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-tranparent border border-black dark:border-white/80 flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {/* use responsive Tailwind sizing so the svg scales on small screens */}
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white/80" strokeWidth={2} />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">{toolName}</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(!showInfo)}
              className="p-1 sm:p-2 rounded-full border border-gray-300 hover:border-gray-900 transition-colors"
            >
              <Info size={20} className="text-gray-600" />
            </motion.button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">{description} • Secure & private</p>
          
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">How it works:</p>
                      <ul className="space-y-1 text-blue-800">
                        {howItWorks.map((step, i) => <li key={i}>• {step}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

  {!file && !(endpoint === 'jpg-to-pdf' && imageFiles.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleInputFiles(e.dataTransfer.files) }}
            className={`bg-white rounded-2xl border-2 border-dashed transition-all mb-6 ${isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
          >
            <label className="block p-12 cursor-pointer">
              <input
                type="file"
                multiple={endpoint === 'jpg-to-pdf'}
                accept={endpoint === 'jpg-to-pdf' ? 'image/*' : acceptedFormats}
                onChange={(e) => handleInputFiles(e.target.files)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${isDragging ? 'border-gray-900 bg-gray-900' : 'border-gray-400'}`}>
                  <Upload size={28} className={isDragging ? 'text-white dark:text-black' : 'text-gray-600'} />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">{fileTypeLabel}</p>
                </div>
              </div>
            </label>
          </motion.div>
        )}

        <AnimatePresence>
          {(file || (endpoint === 'jpg-to-pdf' && imageFiles.length > 0)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 items-stretch"
            >
              {/* Left Column - PDF Preview */}
              <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="px-6 py-4 bg-white">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-gray-600" />
                      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">File Preview</h2>
                    </div>
                    {/* mobile-only toggle to collapse/expand preview */}
                    <div className="ml-auto sm:hidden">
                      <button onClick={() => setPreviewCollapsed(p => !p)} aria-label="Toggle preview" className="px-2 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                        <ArrowUpDown size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                  <div className={`${previewCollapsed ? 'hidden' : 'block'} sm:block p-6 pt-0 flex-1 flex flex-col`}>
                    <div className={`w-full h-full ${endpoint === 'pdf-organize' ? 'min-h-[42rem]' : (['pdf-to-jpg','pdf-rotate','pdf-splitter','pdf-compress'].includes(endpoint) ? 'min-h-[40rem]' : (endpoint === 'pdf-page-numbers' ? 'min-h-[32rem]' : ''))} bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-gray-200`}>
                      {isPdfPrimary && pdfPreview ? (
                        <embed src={pdfPreview} type="application/pdf" className="w-full h-full" />
                      ) : activePreviewUrl ? (
                        <img src={activePreviewUrl} alt={primaryName || 'image'} className="w-full h-full object-contain" />
                      ) : docxPreview ? (
                        <div className="w-full h-full overflow-auto p-4 bg-white">
                          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: docxPreview }} />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 h-full">
                          <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4">
                            <Icon size={40} className="text-gray-700" strokeWidth={1.5} />
                          </div>
                          <p className="text-sm font-semibold text-gray-900 text-center mb-1">{primaryName}</p>
                          <p className="text-xs text-gray-500">{primarySize}</p>
                          <div className="mt-4 px-3 py-1 bg-gray-200 rounded-full">
                            <p className="text-xs font-medium text-gray-700">{primaryName.split('.').pop()?.toUpperCase() || 'FILE'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
              </div>

              {/* Right Column - Actions & Results */}
              <div className="space-y-6">
                {endpoint === 'jpg-to-pdf' && imageFiles.length > 0 ? (
                  <div className="bg-white dark:bg-black rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm p-4">

                    <div className="flex items-center gap-4 overflow-x-auto">
                      <div className="inline-flex items-center gap-3 whitespace-nowrap">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Page size</label>
                        <div className="inline-flex rounded-full bg-gray-100 dark:bg-black p-1 shadow-sm">
                          <motion.button onClick={() => setJpgPageSize('A4')} layout whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className={`px-3 py-1 text-sm rounded-full transition-colors ${jpgPageSize === 'A4' ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>A4</motion.button>
                          <motion.button onClick={() => setJpgPageSize('Letter')} layout whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className={`px-3 py-1 text-sm rounded-full transition-colors ${jpgPageSize === 'Letter' ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Letter</motion.button>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-3 whitespace-nowrap">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Margin</label>
                        <div className="flex items-center gap-2">
                          <input type="number" min={0} value={jpgMarginMm} onChange={(e) => setJpgMarginMm(Number(e.target.value || 0))} className="w-16 p-1.5 rounded-full bg-white dark:bg-black border border-black-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100" />
                          <span className="text-xs text-gray-500">mm</span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-3 whitespace-nowrap">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Orientation</label>
                        <div className="inline-flex rounded-full bg-gray-100 dark:bg-black p-1 shadow-sm">
                          <motion.button onClick={() => setJpgOrientation('portrait')} layout whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className={`px-3 py-1 text-sm rounded-full transition-colors ${jpgOrientation === 'portrait' ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Portrait</motion.button>
                          <motion.button onClick={() => setJpgOrientation('landscape')} layout whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className={`px-3 py-1 text-sm rounded-full transition-colors ${jpgOrientation === 'landscape' ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Landscape</motion.button>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-3 whitespace-nowrap">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Image fit</label>
                        <div className="inline-flex rounded-full bg-gray-100 dark:bg-black p-1 shadow-sm">
                          <motion.button onClick={() => setJpgImageFit('contain')} layout whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className={`px-3 py-1 text-sm rounded-full transition-colors ${jpgImageFit === 'contain' ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Contain</motion.button>
                          <motion.button onClick={() => setJpgImageFit('cover')} layout whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className={`px-3 py-1 text-sm rounded-full transition-colors ${jpgImageFit === 'cover' ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Cover</motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                          <FileText size={20} className="text-red-600" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{primaryName}</p>
                          <p className="text-xs text-gray-500">{primarySize}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setFile(null); setPdfPreview(null); setDocxPreview(null); clearImageFiles(); setResult(null); }}
                        className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-100 border border-gray-300 ml-2 flex items-center gap-1"
                      >
                        <X size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                {/* If this is the pdf-splitter tool, render splitter options above the convert button */}
                {endpoint === 'pdf-splitter' && file && (
                  <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Split options</h3>

                    {/* Toggle left, range inputs animate in at the right (responsive) */}
                    <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="relative">
                        <div
                          ref={toggleContainerRef}
                          role="radiogroup"
                          aria-label="Split mode"
                          onKeyDown={(e) => {
                            // keyboard navigation for segmented control
                            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                              e.preventDefault()
                              setSplitMode((prev) => (prev === 'all' ? 'range' : 'all'))
                              setSplitError(null)
                              ;(rangeBtnRef.current || allBtnRef.current)?.focus()
                            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                              e.preventDefault()
                              setSplitMode((prev) => (prev === 'range' ? 'all' : 'range'))
                              setSplitError(null)
                              ;(allBtnRef.current || rangeBtnRef.current)?.focus()
                            } else if (e.key === 'Home') {
                              e.preventDefault(); setSplitMode('all'); setSplitError(null); allBtnRef.current?.focus()
                            } else if (e.key === 'End') {
                              e.preventDefault(); setSplitMode('range'); setSplitError(null); rangeBtnRef.current?.focus()
                            }
                          }}
                          className="inline-flex items-center rounded-full bg-gray-100 p-1 shadow-sm relative"
                        >
                          {/* measured sliding indicator */}
                          <motion.div
                            layout
                            initial={false}
                            animate={{ left: indicator.left, width: indicator.width }}
                            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                            className="absolute top-0 h-full bg-black dark:bg-white rounded-full shadow-md"
                            style={{ pointerEvents: 'none' }}
                          />

                          <motion.button
                            ref={allBtnRef}
                            role="radio"
                            aria-checked={splitMode === 'all'}
                            tabIndex={splitMode === 'all' ? 0 : -1}
                            onClick={() => { setSplitMode('all'); setSplitError(null) }}
                            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setSplitMode('all'); setSplitError(null) } }}
                            layout
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`relative z-10 px-4 py-1 text-sm rounded-full transition-colors focus:outline-none ${splitMode === 'all' ? 'text-white dark:text-gray-600' : 'text-gray-600'}`}
                          >
                            All pages
                          </motion.button>

                          <motion.button
                            ref={rangeBtnRef}
                            role="radio"
                            aria-checked={splitMode === 'range'}
                            tabIndex={splitMode === 'range' ? 0 : -1}
                            onClick={() => { setSplitMode('range'); setSplitError(null) }}
                            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setSplitMode('range'); setSplitError(null) } }}
                            layout
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`relative z-10 px-4 py-1 text-sm rounded-full transition-colors ${splitMode === 'range' ? 'text-white dark:text-gray-600' : 'text-gray-600'}`}
                          >
                            Page range
                          </motion.button>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex justify-end">
                        {/* Reserve space to avoid layout shift; container has a minimum width so toggle doesn't move when inputs appear */}
                        <div className="min-w-[240px]">
                          <motion.div
                            initial={false}
                            animate={splitMode === 'range' ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                            transition={{ duration: 0.18 }}
                            // keep the element in the layout but prevent interaction when hidden
                            style={{ pointerEvents: splitMode === 'range' ? 'auto' : 'none' }}
                            className="flex items-center gap-3"
                          >
                            {/* Start input group */}
                            <div className="flex items-center border rounded-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              <button
                                type="button"
                                onClick={() => adjustStart(-1)}
                                aria-label="Decrease start page"
                                className="px-2 py-1 bg-transparent text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-40"
                                disabled={Number(startPage) <= 1}
                              >
                                −
                              </button>
                              <input
                                  type="number"
                                  min={1}
                                  placeholder="Start"
                                  value={startPage}
                                  onChange={(e) => handleStartChange(e.target.value)}
                                  onBlur={() => {
                                    if (startPage !== '') setStartPage(clampToPages(Number(startPage)))
                                  }}
                                  className="w-20 p-2 text-center bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                  aria-label="Start page"
                                />
                              <button
                                  type="button"
                                  onClick={() => adjustStart(1)}
                                  aria-label="Increase start page"
                                  className="px-2 py-1 bg-transparent text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                  disabled={totalPages !== null && Number(startPage) >= totalPages}
                                >
                                  +
                                </button>
                            </div>

                            <span className="text-sm text-gray-600">to</span>

                            {/* End input group */}
                            <div className="flex items-center border rounded-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              <button
                                type="button"
                                onClick={() => adjustEnd(-1)}
                                aria-label="Decrease end page"
                                className="px-2 py-1 bg-transparent text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-40"
                                disabled={Number(endPage) <= 1}
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min={1}
                                placeholder="End"
                                value={endPage}
                                onChange={(e) => handleEndChange(e.target.value)}
                                onBlur={() => {
                                  if (endPage !== '') setEndPage(clampToPages(Number(endPage)))
                                }}
                                className="w-20 p-2 text-center bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                aria-label="End page"
                              />
                              <button
                                  type="button"
                                  onClick={() => adjustEnd(1)}
                                  aria-label="Increase end page"
                                  className="px-2 py-1 bg-transparent text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                  disabled={totalPages !== null && Number(endPage) >= totalPages}
                                >
                                  +
                                </button>
                            </div>

                            {totalPages !== null && (
                              <div className="text-sm text-gray-600 ml-3">of {totalPages} pages</div>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {isSplitterRangeInvalid() && !splitError && (
                      <p className="text-xs text-red-600 mt-2">Invalid page range — ensure start ≥ 1 and end ≥ start{totalPages ? ` and ≤ ${totalPages}` : ''}.</p>
                    )}

                    {splitError && (
                      <p className="text-sm text-red-600 mt-3" role="alert" aria-live="assertive">{splitError}</p>
                    )}
                  </div>
                )}

                {/* PDF Page Numbers settings */}
                {endpoint === 'pdf-page-numbers' && file && !result && (
                  <div className="bg-white dark:bg-black rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm p-4 mb-4">
                    <div className="border-b border-gray-200 px-6 py-4 bg-white dark:bg-black">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Settings</h3>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2 block">Position</label>
                          <div className="grid grid-cols-3 gap-2 border border-gray-100 rounded-lg p-2 bg-gray-50 dark:bg-transparent">
                            {[
                              ['top-left'], ['top-center'], ['top-right'],
                              ['bottom-left'], ['bottom-center'], ['bottom-right']
                            ].map(([val]) => (
                              <button
                                key={val}
                                aria-label={`Position ${val}`}
                                onClick={() => setPosition(val as string)}
                                className={`h-10 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 border ${position===val ? 'bg-gray-900 text-white dark:text-black border-transparent' : 'bg-white dark:bg-black text-black dark:text-white border-gray-200 dark:border-gray-700'} flex items-center justify-center transition-all`}
                              >
                                {String(val).replace('-', ' ')}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Choose where page numbers will appear</p>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2 block">Start Number</label>
                          <input type="number" value={startNumber} onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)} min={1} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white" />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2 block">Format</label>
                          <select value={formatStr} onChange={(e) => setFormatStr(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white">
                            <option value="Page {n}">Page {`{n}`}</option>
                            <option value="{n}">{`{n}`}</option>
                            <option value="- {n} -">- {`{n}`} -</option>
                            <option value="[{n}]">[{`{n}`} ]</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2 block">Font Size</label>
                          <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value) || 12)} min={8} max={48} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white dark:bg-black text-gray-900 dark:text-white" />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2 block">Color</label>
                          <div className="flex items-center gap-3">
                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer bg-white dark:bg-black" />
                            <div className="text-sm text-gray-600 dark:text-gray-400">Selected: <span className="font-medium text-gray-900 dark:text-gray-200">{color.toUpperCase()}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* For jpg-to-pdf: show reorderable image list when multiple images present (collapses when result appears) */}
                <AnimatePresence>
                  {endpoint === 'jpg-to-pdf' && imageFiles.length > 0 && !result && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="bg-white dark:bg-black rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm overflow-hidden mb-4">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 bg-white dark:bg-black flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Images</h3>
                          <span className="inline-flex items-center justify-center text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded">{imageFiles.length}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Click an item to preview • Drag to reorder</p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        {/* hidden file input for adding more images */}
                        <input ref={addInputRef} type="file" multiple accept="image/*" onChange={(e) => handleInputFiles(e.target.files)} className="hidden" />
                        <button onClick={() => addInputRef.current?.click()} className="text-sm px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black-700 flex items-center gap-2">
                          <Plus size={16} className="sm:hidden text-gray-600 dark:text-gray-200" />
                          <span className="hidden sm:inline">Add more</span>
                        </button>
                        <button onClick={() => { setImageFiles([...imageFiles].reverse()); setActiveImageIndex(0) }} className="text-sm px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black-700 flex items-center gap-2">
                          <ArrowUpDown size={16} className="sm:hidden text-gray-600 dark:text-gray-200" />
                          <span className="hidden sm:inline">Reverse</span>
                        </button>
                        <button onClick={() => { clearImageFiles(); setResult(null) }} className="text-sm px-3 py-1.5 rounded-full border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 flex items-center gap-2">
                          <X size={16} className="sm:hidden text-red-600 dark:text-red-300" />
                          <span className="hidden sm:inline">Clear</span>
                        </button>
                      </div>
                    </div>

                    <Reorder.Group axis="y" values={imageFiles} onReorder={setImageFiles} className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[26rem] overflow-y-auto scrollbar-hide">
                      {imageFiles.map((img, idx) => (
                        <Reorder.Item key={img.id} value={img}>
                          <div className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-black-700 transition-colors cursor-grab active:cursor-grabbing">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-black flex items-center justify-center flex-shrink-0">
                              {img.preview ? (
                                <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">No preview</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0" onClick={() => setActiveImageIndex(idx)}>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{img.name}</p>
                                {img.status !== 'done' && !img.uploadStatus && (
                                    <Loader2 size={14} className="text-gray-400 animate-spin" />
                                  )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{img.size}</p>

                              {img.uploadStatus ? (
                                <div className="mt-2 w-full">
                                  <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${img.uploadStatus === 'failed' ? 'bg-red-500' : 'bg-green-600'} dark:bg-green-400`} style={{ width: `${img.uploadProgress || 0}%` }} />
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1 dark:text-gray-300">{img.uploadStatus === 'failed' ? 'Upload failed' : `${img.uploadProgress || 0}%`}</div>
                                </div>
                              ) : img.status !== 'done' ? (
                                <div className="mt-2 w-full">
                                  <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 dark:bg-blue-400" style={{ width: `${img.progress || 0}%` }} />
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1 dark:text-gray-300">{img.progress ? `${img.progress}%` : 'Preparing...'}</div>
                                </div>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-400 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">#{idx + 1}</span>
                              <button onClick={() => { if (img.preview) try { URL.revokeObjectURL(img.preview) } catch(e){}; setImageFiles(prev => prev.filter(p => p.id !== img.id)); setActiveImageIndex(0); }} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"><X size={16} className="text-gray-600 dark:text-gray-200" /></button>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </motion.div>
                  )}
                </AnimatePresence>

                {/* PDF -> JPG image options */}
                {endpoint === 'pdf-to-jpg' && file && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="bg-white dark:bg-black rounded-2xl border border-gray-300 dark:border-gray-700 shadow p-4 mb-4"
                  >
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Image options</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Format */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 block">Format</label>
                        <div className="inline-flex rounded-full bg-gray-100 dark:bg-black p-1 shadow-sm">
                          <motion.button
                            onClick={() => setImgFormat('jpg')}
                            layout
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${imgFormat === 'jpg' ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                          >JPG</motion.button>
                          <motion.button
                            onClick={() => setImgFormat('png')}
                            layout
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${imgFormat === 'png' ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                          >PNG</motion.button>
                        </div>
                      </div>

                      {/* Quality */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 block">Quality ({imgQuality}%)</label>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={imgQuality}
                          onChange={(e) => setImgQuality(Number(e.target.value))}
                          className="w-full appearance-none h-1 rounded-lg bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-0 accent-black dark:accent-white"
                        />
                      </div>

                      {/* DPI */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 block">Resolution (DPI)</label>
                        <div className="flex items-center gap-2">
                          <select
                            value={String(imgDpi)}
                            onChange={(e) => setImgDpi(Number(e.target.value))}
                            className="p-2 rounded-full bg-white dark:bg-black border border-black-600 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100"
                          >
                            <option value={72}>72 DPI</option>
                            <option value={150}>150 DPI</option>
                            <option value={300}>300 DPI</option>
                          </select>
                          <input
                            type="number"
                            min={1}
                            value={imgDpi}
                            onChange={(e) => setImgDpi(Number(e.target.value || 0))}
                            className="w-20 p-2 rounded-full bg-white dark:bg-black border border-black-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-100"
                          />
                        </div>
                      </div>

                      {/* Grayscale & Separate files */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Color</label>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input id="grayscale" type="checkbox" checked={imgGrayscale} onChange={(e) => setImgGrayscale(e.target.checked)} className="h-4 w-4 accent-black dark:accent-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-full" />
                            <label htmlFor="grayscale" className="text-sm text-gray-700 dark:text-gray-200">Grayscale</label>
                          </div>
                          <motion.div
                            key={imgGrayscale ? 'gs' : 'color'}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="text-xs text-gray-500 dark:text-gray-400"
                          >
                            {imgGrayscale ? 'Monochrome preview' : 'Color preview'}
                          </motion.div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input id="separate" type="checkbox" checked={separateFiles} onChange={(e) => setSeparateFiles(e.target.checked)} className="h-4 w-4 accent-black dark:accent-white bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded" />
                            <label htmlFor="separate" className="text-sm text-gray-700 dark:text-gray-200">Separate images per page</label>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{separateFiles ? 'Yes' : 'Single combined'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Rotate PDF options (shown for pdf-rotate tool) */}
                {endpoint === 'pdf-rotate' && file && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="bg-white dark:bg-black rounded-2xl border border-gray-300 dark:border-gray-700 shadow p-4 mb-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Rotate options</h3>

                      {/* controls: keep presets only (slider removed) */}
                      <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto flex-nowrap">
                        <div className="inline-flex rounded-full bg-gray-100 dark:bg-black p-1 shadow-sm flex-shrink-0">
                          <button onClick={() => setRotateAngle(90)} className={`px-3 py-1 text-sm rounded-full transition-colors ${rotateAngle === 90 ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>90°</button>
                          <button onClick={() => setRotateAngle(180)} className={`px-3 py-1 text-sm rounded-full transition-colors ${rotateAngle === 180 ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>180°</button>
                          <button onClick={() => setRotateAngle(270)} className={`px-3 py-1 text-sm rounded-full transition-colors ${rotateAngle === 270 ? 'bg-black text-white dark:bg-black dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>270°</button>
                        </div>
                        <div className="text-sm text-gray-600 ml-3">Selected: {rotateAngle}°</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Page order UI for organize tool: show above the convert button */}
                {endpoint === 'pdf-organize' && file && !result && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }} className="bg-white dark:bg-black rounded-2xl border border-gray-300 dark:border-gray-700 shadow-sm overflow-hidden mb-4">
                    <div className="border-b border-gray-200 px-6 py-4 bg-white">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Page Order</h3>
                    </div>
                    <div className="p-0 space-y-3 flex-1 flex flex-col overflow-y-auto max-h-[500px]">
                      {pageOrder.length > 0 ? (
                        <Reorder.Group axis="y" values={pageOrder} onReorder={setPageOrder} className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[26rem] overflow-y-auto scrollbar-hide">
                          {pageOrder.map((page, index) => (
                            <Reorder.Item key={page} value={page}>
                              <div className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-black-700 transition-colors cursor-grab active:cursor-grabbing">
                                <div className="w-6 h-6 flex items-center justify-center text-gray-400 dark:text-gray-300">
                                  <GripVertical size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Page {page}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Original page #{page}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-gray-400 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">#{index + 1}</span>
                                </div>
                              </div>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Upload a PDF to reorder pages</div>
                      )}
                    </div>
                  </motion.div>
                )}
                {!result && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConvert}
                    disabled={isProcessing || isSplitterRangeInvalid() || (endpoint === 'pdf-organize' && pageOrder.length === 0)}
                    className="relative w-full py-5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group"
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
                        <span>{processingText}</span>
                      </>
                    ) : (
                      <>
                        <Icon size={20} className="group-hover:scale-110 transition-transform" />
                        <span>{buttonText}</span>
                      </>
                    )}
                  </motion.button>
                )}

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-300 shadow-xl overflow-hidden"
                  >
                    <div className="p-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center"
                      >
                        <CheckCircle2 size={32} className="text-white dark:text-white" strokeWidth={2} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Success!</h3>
                      <p className="text-sm text-gray-600 text-center mb-6">Your file has been converted successfully</p>
                      
                      <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-300">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <Icon size={20} className="text-white dark:text-white" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{downloadName}</p>
                                <p className="text-xs text-gray-500">Ready to download</p>
                                {result?.method && (
                                  <p className="text-xs text-gray-500 mt-1">Converted using: <span className="font-medium text-gray-700">{result.method}</span></p>
                                )}
                          </div>
                        </div>
                      </div>

                      <motion.a
                        href={result.url}
                        download={downloadName}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="block w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mb-3 shadow-lg"
                      >
                        <Download size={20} />
                        Download File
                      </motion.a>
                      
                      <button
                        onClick={() => { setFile(null); setPdfPreview(null); setDocxPreview(null); clearImageFiles(); setResult(null); }}
                        className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Upload size={18} />
                        Convert Another File
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!file && !(endpoint === 'jpg-to-pdf' && imageFiles.length > 0) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div className="inline-block mb-4">
                <Icon size={48} className="text-gray-300" strokeWidth={1.5} />
              </motion.div>
              <p className="text-sm text-gray-500">Upload a file to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
