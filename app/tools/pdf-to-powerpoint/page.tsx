'use client'
import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'

export default function PDFToPowerPointPage() {
  return (
    <PDFConversionTemplate
      toolName="PDF to PowerPoint"
      description="Convert PDF documents to PowerPoint presentation format"
      iconName="Presentation"
      endpoint="pdf-to-powerpoint"
      buttonText="Convert to PowerPoint"
      processingText="Converting to PowerPoint..."
      downloadName="converted.pptx"
      howItWorks={[
        'Upload your PDF file',
        'Pages converted to slides',
        'Download as PowerPoint presentation',
        'All processing happens securely'
      ]}
    />
  )
}