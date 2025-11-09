'use client'
import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'

export default function ExcelToPDFPage() {
  return (
    <PDFConversionTemplate
      toolName="Excel to PDF"
      description="Convert Excel spreadsheets to PDF format"
      iconName="FileSpreadsheet"
      endpoint="excel-to-pdf"
      buttonText="Convert to PDF"
      processingText="Converting to PDF..."
      downloadName="converted.pdf"
      acceptedFormats=".xls,.xlsx"
      fileTypeLabel="Excel files (.xls, .xlsx)"
      howItWorks={[
        'Upload your Excel file',
        'Spreadsheet converted to PDF',
        'Download formatted PDF document',
        'All processing happens securely'
      ]}
    />
  )
}