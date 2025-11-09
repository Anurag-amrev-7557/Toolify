import PDFDeletePagesTemplate from '@/app/components/PDFDeletePagesTemplate'

export default function DeletePagesPage() {
  return (
    <PDFDeletePagesTemplate
      title="Delete Pages"
      description="Remove unwanted pages from your PDF"
      endpoint="http://localhost:5001/api/process/pdf-delete-pages"
    />
  )
}
