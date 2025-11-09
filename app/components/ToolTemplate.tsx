'use client'
import { useState } from 'react'

interface ToolTemplateProps {
  toolName: string
  description: string
  acceptedFormats: string
  onProcess: (file: File, options: any) => Promise<any>
  options?: React.ReactNode
}

export default function ToolTemplate({ toolName, description, acceptedFormats, onProcess, options }: ToolTemplateProps) {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

  const handleProcess = async () => {
    if (!file) return
    setProcessing(true)
    try {
      const res = await onProcess(file, {})
      setResult(res)
    } catch (error) {
      alert('Processing failed')
    }
    setProcessing(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{toolName}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center mb-6 bg-white dark:bg-gray-800">
        <input type="file" accept={acceptedFormats} onChange={handleFileChange} className="mb-4 text-gray-900 dark:text-white" />
        {file && <p className="text-sm text-gray-600 dark:text-gray-400">Selected: {file.name}</p>}
      </div>

      {options && <div className="mb-6">{options}</div>}

      <button onClick={handleProcess} disabled={!file || processing}
        className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-700 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
        {processing ? 'Processing...' : 'Process'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="font-semibold mb-2 text-gray-900 dark:text-white">Done!</p>
          <button className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors">Download</button>
        </div>
      )}
    </div>
  )
}
