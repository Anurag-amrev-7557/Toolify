'use client'
import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'
import { Presentation } from 'lucide-react'

export default function PowerPointToPDFPage() {
  return (
    <PDFConversionTemplate
      toolName="PowerPoint to PDF"
      description="Convert PowerPoint presentations to PDF format"
      icon={Presentation}
      endpoint="powerpoint-to-pdf"
      buttonText="Convert to PDF"
      processingText="Converting to PDF..."
      downloadName="converted.pdf"
      acceptedFormats=".ppt,.pptx"
      fileTypeLabel="PowerPoint files (.ppt, .pptx)"
      howItWorks={[
        'Upload your PowerPoint file',
        'Slides converted to PDF pages',
        'Download shareable PDF document',
        'All processing happens securely'
      ]}
    />
  )
}