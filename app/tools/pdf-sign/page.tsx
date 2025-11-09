import PDFSignTemplate from '@/app/components/PDFSignTemplate'

export default function SignPDFPage() {
  return (
    <PDFSignTemplate
      title="Sign PDF"
      description="Add digital signature to your PDF"
      endpoint="http://localhost:5001/api/process/pdf-sign"
    />
  )
}
