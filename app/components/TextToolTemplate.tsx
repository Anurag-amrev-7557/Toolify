'use client'
import { useState } from 'react'

interface TextToolTemplateProps {
  toolName: string
  description: string
  onProcess: (text: string, options: any) => Promise<any>
  placeholder?: string
}

export default function TextToolTemplate({ toolName, description, onProcess, placeholder }: TextToolTemplateProps) {
  const [text, setText] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleProcess = async () => {
    if (!text) return
    setProcessing(true)
    try {
      const res = await onProcess(text, {})
      setResult(res)
    } catch (error) {
      alert('Processing failed')
    }
    setProcessing(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{toolName}</h1>
      <p className="text-gray-600 mb-8">{description}</p>

      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || 'Enter text here...'}
        className="w-full h-48 p-4 border rounded-lg mb-6" />

      <button onClick={handleProcess} disabled={!text || processing}
        className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-300">
        {processing ? 'Processing...' : 'Process'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
