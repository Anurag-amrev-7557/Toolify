'use client'
import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'

export default function WordToPDFPage() {
  return (
    <PDFConversionTemplate
      toolName="Word to PDF"
      description="Convert Word documents to PDF format"
      iconName="FileText"
      endpoint="word-to-pdf"
      buttonText="Convert to PDF"
      processingText="Converting to PDF..."
      downloadName="converted.pdf"
      acceptedFormats=".doc,.docx"
      fileTypeLabel="Word documents (.doc, .docx)"
      howItWorks={[
        'Upload your Word document',
        'Content converted to PDF format',
        'Download professional PDF file',
        'All processing happens securely'
      ]}
    />
  )
}