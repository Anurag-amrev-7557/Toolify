"use client"

import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'

export default function RepairPDFPage() {
  return (
    <PDFConversionTemplate
      toolName="Repair PDF"
      description="Fix corrupted or damaged PDF files"
      iconName="Wrench"
      endpoint="pdf-repair"
      buttonText="Repair PDF"
      processingText="Repairing PDF..."
      downloadName="repaired.pdf"
      howItWorks={[
        'Upload your corrupted PDF file',
        'Automatic repair attempts will be made',
        'Download the repaired PDF if successful',
        'All processing happens securely'
      ]}
    />
  )
}
