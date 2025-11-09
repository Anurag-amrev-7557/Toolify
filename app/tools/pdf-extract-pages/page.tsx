import PDFExtractPagesTemplate from '@/app/components/PDFExtractPagesTemplate'

export default function ExtractPagesPage() {
  return (
    <PDFExtractPagesTemplate
      title="Extract Pages"
      description="Extract specific pages from your PDF"
      endpoint="http://localhost:5001/api/process/pdf-extract-pages"
    />
  )
}
