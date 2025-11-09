import HTMLToPDFTemplate from '@/app/components/HTMLToPDFTemplate'

export default function HTMLToPDFPage() {
  return (
    <HTMLToPDFTemplate
      title="HTML to PDF"
      description="Convert HTML content to PDF document"
      endpoint="http://localhost:5001/api/process/html-to-pdf"
    />
  )
}
