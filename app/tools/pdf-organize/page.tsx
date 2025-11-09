import PDFConversionTemplate from '@/app/components/PDFConversionTemplate'

export default function OrganizePDFPage() {
  return (
    <PDFConversionTemplate
      toolName="Organize PDF"
      description="Reorder pages in your PDF document"
      iconName="ArrowUpDown"
      endpoint="pdf-organize"
      buttonText="Organize Pages"
      processingText="Organizing..."
      downloadName="organized.pdf"
      howItWorks={["Upload your PDF file", "Reorder pages using arrows", "Download organized PDF", "All processing happens securely"]}
    />
  )
}
