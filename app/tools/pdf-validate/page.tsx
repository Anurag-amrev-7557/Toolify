import PDFValidateTemplate from '@/app/components/PDFValidateTemplate'

export default function ValidatePDFPage() {
  return (
    <PDFValidateTemplate
      title="Validate PDF"
      description="Check if your PDF file is valid"
      endpoint="http://localhost:5001/api/process/pdf-validate"
    />
  )
}
