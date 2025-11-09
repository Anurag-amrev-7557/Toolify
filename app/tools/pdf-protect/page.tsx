import PDFProtectTemplate from '@/app/components/PDFProtectTemplate'

export default function ProtectPDFPage() {
  return (
    <PDFProtectTemplate
      title="Protect PDF"
      description="Add password protection to your PDF files"
      endpoint="http://localhost:5001/api/process/pdf-protect"
    />
  )
}
