"use client"
import ToolTemplate from '@/app/components/ToolTemplate'
import TextToolTemplate from '@/app/components/TextToolTemplate'
import GeneratorTemplate from '@/app/components/GeneratorTemplate'
import WordCounterTemplate from '@/app/components/WordCounterTemplate'
import UUIDGeneratorTemplate from '@/app/components/UUIDGeneratorTemplate'
import PDFMergeTemplate from '@/app/components/PDFMergeTemplate'
import PDFSplitterTemplate from '@/app/components/PDFSplitterTemplate'
import PDFCompressTemplate from '@/app/components/PDFCompressTemplate'
import PDFToJPGTemplate from '@/app/components/PDFToJPGTemplate'
import JPGToPDFTemplate from '@/app/components/JPGToPDFTemplate'
import PDFToolTemplate from '@/app/components/PDFToolTemplate'
import PDFRotateTemplate from '@/app/components/PDFRotateTemplate'
import PDFWatermarkTemplate from '@/app/components/PDFWatermarkTemplate'
import ImageCompressorTemplate from '@/app/components/ImageCompressorTemplate'
import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'
import { useParams } from 'next/navigation'
import { RotateCw, Droplets, Lock, Unlock, ArrowUpDown, Hash, Wrench, FileCheck, FileCode, Eye, Shield, FileText, FileSpreadsheet, Presentation, Scissors, Image } from 'lucide-react'
import { API_URL } from '@/app/lib/config'

const toolConfigs: Record<string, any> = {
  'pdf-merger': { name: 'PDF Merger', description: 'Combine multiple PDF files into one', formats: '.pdf' },
  'pdf-splitter': { name: 'PDF Splitter', description: 'Split PDF into separate pages', formats: '.pdf' },
  'pdf-compress': { name: 'PDF Compressor', description: 'Reduce PDF file size', formats: '.pdf' },
  'pdf-to-jpg': { name: 'PDF to JPG', description: 'Convert PDF pages to JPG images', formats: '.pdf' },
  'jpg-to-pdf': { name: 'JPG to PDF', description: 'Convert images to PDF', formats: 'image/*' },
  'pdf-rotate': { name: 'Rotate PDF', description: 'Rotate PDF pages', formats: '.pdf' },
  'pdf-watermark': { name: 'Watermark PDF', description: 'Add watermark to PDF', formats: '.pdf' },
  'pdf-unlock': { name: 'Unlock PDF', description: 'Remove PDF password', formats: '.pdf' },
  'pdf-protect': { name: 'Protect PDF', description: 'Add password to PDF', formats: '.pdf' },
  'pdf-organize': { name: 'Organize PDF', description: 'Reorder PDF pages', formats: '.pdf' },
  'pdf-page-numbers': { name: 'Add Page Numbers', description: 'Add page numbers to PDF', formats: '.pdf' },
  'pdf-extract-pages': { name: 'Extract Pages', description: 'Extract specific pages', formats: '.pdf' },
  'pdf-delete-pages': { name: 'Delete Pages', description: 'Remove pages from PDF', formats: '.pdf' },
  'pdf-repair': { name: 'Repair PDF', description: 'Fix corrupted PDF files', formats: '.pdf' },
  'pdf-to-pdfa': { name: 'PDF to PDF/A', description: 'Convert to PDF/A format', formats: '.pdf' },
  'html-to-pdf': { name: 'HTML to PDF', description: 'Convert HTML to PDF', formats: '.html' },
  'pdf-ocr': { name: 'PDF OCR', description: 'Extract text from scanned PDF', formats: '.pdf' },
  'pdf-sign': { name: 'Sign PDF', description: 'Digitally sign PDF', formats: '.pdf' },
  'pdf-validate': { name: 'Validate PDF', description: 'Check PDF integrity', formats: '.pdf' },
  'pdf-to-word': { name: 'PDF to Word', description: 'Convert PDF to Word document', formats: '.pdf' },
  'word-to-pdf': { name: 'Word to PDF', description: 'Convert Word document to PDF', formats: '.doc,.docx' },
  'pdf-to-excel': { name: 'PDF to Excel', description: 'Convert PDF to Excel spreadsheet', formats: '.pdf' },
  'excel-to-pdf': { name: 'Excel to PDF', description: 'Convert Excel spreadsheet to PDF', formats: '.xls,.xlsx' },
  'pdf-to-powerpoint': { name: 'PDF to PowerPoint', description: 'Convert PDF to PowerPoint presentation', formats: '.pdf' },
  'powerpoint-to-pdf': { name: 'PowerPoint to PDF', description: 'Convert PowerPoint presentation to PDF', formats: '.ppt,.pptx' },
  'image-compressor': { name: 'Image Compressor', description: 'Reduce image file size', formats: 'image/*' },
  'word-counter': { name: 'Word Counter', description: 'Count words, characters, sentences', formats: '.txt' },
  'json-formatter': { name: 'JSON Formatter', description: 'Format and validate JSON', formats: '.json,.txt' },
  'base64-encoder': { name: 'Base64 Encoder', description: 'Encode/decode Base64', formats: '*' },
  'qr-generator': { name: 'QR Code Generator', description: 'Generate QR codes from text', formats: '' },
  'uuid-generator': { name: 'UUID Generator', description: 'Generate unique identifiers', formats: '' },
  'password-generator': { name: 'Password Generator', description: 'Generate secure passwords', formats: '' },
  'hash-generator': { name: 'Hash Generator', description: 'Generate MD5, SHA256 hashes', formats: '.txt' },
  'text-diff': { name: 'Text Diff', description: 'Compare two text files', formats: '.txt' },
  'case-converter': { name: 'Case Converter', description: 'Convert text case', formats: '.txt' },
}

export default function ToolPage() {
  const params = useParams()
  const config = toolConfigs[params.slug as string]

  if (!config) return <div className="p-8">Tool not found</div>

  const handleProcess = async (file: File, options: any) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await fetch(`${API_URL}/api/process/${params.slug}`, {
      method: 'POST',
      body: formData,
    })
    return res.json()
  }

  const textTools = ['json-formatter', 'base64-encoder', 'hash-generator', 'case-converter']
  const generators = ['password-generator', 'qr-generator']
  
  if (params.slug === 'pdf-merger') return <PDFMergeTemplate toolName={config.name} description={config.description} onProcess={async () => {}} />
  if (params.slug === 'pdf-splitter') return (
    <PDFConversionTemplate
      toolName={config.name}
      description={config.description}
      iconName="Scissors"
      endpoint="pdf-splitter"
      buttonText="Split PDF"
      processingText="Splitting..."
      downloadName="split-pages.zip"
      howItWorks={["Upload your PDF file", "Split into separate pages", "Download as a zip of pages", "All processing happens securely"]}
    />
  )
  if (params.slug === 'pdf-compress') return (
    <PDFConversionTemplate
      toolName={config.name}
      description={config.description}
      iconName="Droplets"
      endpoint="pdf-compress"
      buttonText="Compress PDF"
      processingText="Compressing..."
      downloadName="compressed.pdf"
      howItWorks={["Upload your PDF file", "Compress to reduce file size", "Download optimized PDF", "All processing happens securely"]}
    />
  )
  if (params.slug === 'pdf-to-jpg') return (
    <PDFConversionTemplate
      toolName={config.name}
      description={config.description}
      iconName="Image"
      endpoint="pdf-to-jpg"
      buttonText="Convert to JPG"
      processingText="Converting to JPG..."
      downloadName="pdf-images.zip"
      howItWorks={["Upload your PDF file", "Convert pages to JPG images", "Download as a zip of images", "All processing happens securely"]}
    />
  )
  if (params.slug === 'jpg-to-pdf') return (
    <PDFConversionTemplate
      toolName={config.name}
      description={config.description}
      iconName="Image"
      endpoint="jpg-to-pdf"
      buttonText="Convert to PDF"
      processingText="Converting images to PDF..."
      downloadName="images-to-pdf.pdf"
      acceptedFormats="image/*"
      fileTypeLabel="Image files"
      howItWorks={["Upload one or more images", "Images will be combined into a PDF", "Download the resulting PDF", "All processing happens securely"]}
    />
  )
  if (params.slug === 'pdf-rotate') return (
    <PDFConversionTemplate
      toolName={config.name}
      description={config.description}
      iconName="RotateCw"
      endpoint="pdf-rotate"
      buttonText="Rotate PDF"
      processingText="Rotating PDF..."
      downloadName="rotated.pdf"
      howItWorks={["Upload your PDF file", "Choose rotation and apply to pages", "Download rotated PDF", "All processing happens securely"]}
    />
  )
  if (params.slug === 'pdf-watermark') return <PDFWatermarkTemplate toolName={config.name} description={config.description} />
  if (params.slug === 'pdf-unlock') return <PDFToolTemplate toolName={config.name} description={config.description} icon={Unlock} endpoint="pdf-unlock" buttonText="Unlock PDF" processingText="Unlocking..." downloadName="unlocked.pdf" />
  if (params.slug === 'pdf-protect') return <PDFToolTemplate toolName={config.name} description={config.description} icon={Lock} endpoint="pdf-protect" buttonText="Protect PDF" processingText="Protecting..." downloadName="protected.pdf" extraFormData={() => ({ password: 'password123' })} />
  if (params.slug === 'pdf-organize') return (
    <PDFConversionTemplate
      toolName={config.name}
      description={config.description}
      iconName="ArrowUpDown"
      endpoint="pdf-organize"
      buttonText="Organize Pages"
      processingText="Organizing..."
      downloadName="organized.pdf"
      howItWorks={["Upload your PDF file", "Reorder pages using arrows", "Download organized PDF", "All processing happens securely"]}
    />
  )
  if (params.slug === 'pdf-page-numbers') return <PDFToolTemplate toolName={config.name} description={config.description} icon={Hash} endpoint="pdf-page-numbers" buttonText="Add Page Numbers" processingText="Adding numbers..." downloadName="numbered.pdf" />
  if (params.slug === 'pdf-repair') return <PDFToolTemplate toolName={config.name} description={config.description} icon={Wrench} endpoint="pdf-repair" buttonText="Repair PDF" processingText="Repairing..." downloadName="repaired.pdf" />
  if (params.slug === 'pdf-to-pdfa') return <PDFToolTemplate toolName={config.name} description={config.description} icon={FileCode} endpoint="pdf-to-pdfa" buttonText="Convert to PDF/A" processingText="Converting..." downloadName="pdfa.pdf" />
  if (params.slug === 'pdf-sign') return <PDFToolTemplate toolName={config.name} description={config.description} icon={Shield} endpoint="pdf-sign" buttonText="Sign PDF" processingText="Signing..." downloadName="signed.pdf" />
  if (params.slug === 'pdf-validate') return <PDFToolTemplate toolName={config.name} description={config.description} icon={FileCheck} endpoint="pdf-validate" buttonText="Validate PDF" processingText="Validating..." downloadName="validated.pdf" />
  if (params.slug === 'pdf-to-word') return <PDFToolTemplate toolName={config.name} description={config.description} icon={FileText} endpoint="pdf-to-word" buttonText="Convert to Word" processingText="Converting..." downloadName="converted.docx" />
  if (params.slug === 'word-to-pdf') return <PDFToolTemplate toolName={config.name} description={config.description} icon={FileText} endpoint="word-to-pdf" buttonText="Convert to PDF" processingText="Converting..." downloadName="converted.pdf" acceptedFormats=".doc,.docx" fileTypeLabel="Word documents (.doc, .docx)" />
  if (params.slug === 'pdf-to-excel') return <PDFToolTemplate toolName={config.name} description={config.description} icon={FileSpreadsheet} endpoint="pdf-to-excel" buttonText="Convert to Excel" processingText="Converting..." downloadName="converted.xlsx" />
  if (params.slug === 'excel-to-pdf') return <PDFToolTemplate toolName={config.name} description={config.description} icon={FileSpreadsheet} endpoint="excel-to-pdf" buttonText="Convert to PDF" processingText="Converting..." downloadName="converted.pdf" acceptedFormats=".xls,.xlsx" fileTypeLabel="Excel files (.xls, .xlsx)" />
  if (params.slug === 'pdf-to-powerpoint') return <PDFToolTemplate toolName={config.name} description={config.description} icon={Presentation} endpoint="pdf-to-powerpoint" buttonText="Convert to PowerPoint" processingText="Converting..." downloadName="converted.pptx" />
  if (params.slug === 'powerpoint-to-pdf') return <PDFToolTemplate toolName={config.name} description={config.description} icon={Presentation} endpoint="powerpoint-to-pdf" buttonText="Convert to PDF" processingText="Converting..." downloadName="converted.pdf" acceptedFormats=".ppt,.pptx" fileTypeLabel="PowerPoint files (.ppt, .pptx)" />
  if (params.slug === 'image-compressor') return <ImageCompressorTemplate toolName={config.name} description={config.description} onProcess={async () => {}} />
  
  if (params.slug === 'word-counter') {
    return <WordCounterTemplate toolName={config.name} description={config.description} 
      onProcess={async (text) => {
        const formData = new FormData()
        formData.append('text', text)
        const res = await fetch(`${API_URL}/api/process/${params.slug}`, {
          method: 'POST',
          body: formData,
        })
        return res.json()
      }} />
  }
  
  if (params.slug === 'uuid-generator') {
    return <UUIDGeneratorTemplate toolName={config.name} description={config.description} 
      onGenerate={async () => {
        const res = await fetch(`${API_URL}/api/process/${params.slug}`, { method: 'POST' })
        return res.json()
      }} />
  }
  
  if (generators.includes(params.slug as string)) {
    return <GeneratorTemplate toolName={config.name} description={config.description} 
      onGenerate={async () => {
        const res = await fetch(`${API_URL}/api/process/${params.slug}`, { method: 'POST' })
        return res.json()
      }} />
  }
  
  if (textTools.includes(params.slug as string)) {
    return <TextToolTemplate toolName={config.name} description={config.description} 
      onProcess={async (text) => {
        const formData = new FormData()
        formData.append('text', text)
        const res = await fetch(`${API_URL}/api/process/${params.slug}`, {
          method: 'POST',
          body: formData,
        })
        return res.json()
      }} />
  }
  
  return <ToolTemplate toolName={config.name} description={config.description} 
    acceptedFormats={config.formats} onProcess={handleProcess} />
}
