"use client"

import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'

export default function PDFToPDFAPage() {
  return (
    <PDFConversionTemplate
      toolName="PDF to PDF/A"
      description="Convert PDF to PDF/A archival format"
      iconName="Archive"
      endpoint="pdf-to-pdfa"
      buttonText="Convert to PDF/A"
      processingText="Converting to PDF/A..."
      downloadName="pdfa.pdf"
      howItWorks={[
        'Upload your PDF file',
        'Convert to PDF/A archival format',
        'Download the standardized PDF/A file',
        'All processing happens securely'
      ]}
    />
  )
}
