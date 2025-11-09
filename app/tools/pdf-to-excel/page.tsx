'use client'
import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'

export default function PDFToExcelPage() {
  return (
    <PDFConversionTemplate
      toolName="PDF to Excel"
      description="Convert PDF documents to Excel spreadsheet format"
      iconName="FileSpreadsheet"
      endpoint="pdf-to-excel"
      buttonText="Convert to Excel"
      processingText="Converting to Excel..."
      downloadName="converted.xlsx"
      howItWorks={[
        'Upload your PDF file',
        'Data extracted and structured',
        'Download as Excel spreadsheet',
        'All processing happens securely'
      ]}
    />
  )
}