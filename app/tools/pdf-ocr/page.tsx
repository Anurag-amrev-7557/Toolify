import PDFOCRTemplate from '@/app/components/PDFOCRTemplate'

export default function PDFOCRPage() {
  return (
    <PDFOCRTemplate
      title="PDF OCR"
      description="Extract text from scanned PDF documents"
      endpoint="http://localhost:5001/api/process/pdf-ocr"
    />
  )
}
