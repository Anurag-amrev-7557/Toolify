import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'

export default function PDFPageNumbersPage() {
  return (
    <PDFConversionTemplate
      toolName="Add Page Numbers"
      description="Add page numbers to your PDF document"
      iconName="Hash"
      endpoint="pdf-page-numbers"
      buttonText="Add Page Numbers"
      processingText="Adding numbers..."
      downloadName="numbered.pdf"
      acceptedFormats=".pdf"
      fileTypeLabel="PDF files only"
      howItWorks={["Upload a PDF file", "Choose position and starting number", "Download PDF with page numbers", "All processing happens securely"]}
    />
  )
}
