'use client'
import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'
import { FileText } from 'lucide-react'

export default function PDFToWordPage() {
  return (
    <PDFConversionTemplate
      toolName="PDF to Word"
      description="Convert PDF documents to editable Word format"
      iconName="FileText"
      endpoint="pdf-to-word"
      buttonText="Convert to Word"
      processingText="Converting to Word..."
      downloadName="converted.docx"
      howItWorks={[
        'Upload your PDF file',
        'Text extracted and formatted',
        'Download as editable Word document',
        'All processing happens securely'
      ]}
    />
  )
}