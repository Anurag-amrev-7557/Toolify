import PDFUnlockTemplate from '@/app/components/PDFUnlockTemplate'

export default function UnlockPDFPage() {
  return (
    <PDFUnlockTemplate
      title="Unlock PDF"
      description="Remove password protection from your PDF files"
      endpoint="http://localhost:5001/api/process/pdf-unlock"
    />
  )
}
