'use client'
import { useState } from 'react'

interface GeneratorTemplateProps {
  toolName: string
  description: string
  onGenerate: (options: any) => Promise<any>
  options?: React.ReactNode
}

export default function GeneratorTemplate({ toolName, description, onGenerate, options }: GeneratorTemplateProps) {
  const [result, setResult] = useState<any>(null)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await onGenerate({})
      setResult(res)
    } catch (error) {
      alert('Generation failed')
    }
    setGenerating(false)
  }

  const copyToClipboard = () => {
    const text = typeof result === 'object' ? JSON.stringify(result) : result
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{toolName}</h1>
      <p className="text-gray-600 mb-8">{description}</p>

      {options && <div className="mb-6">{options}</div>}

      <button onClick={handleGenerate} disabled={generating}
        className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-300">
        {generating ? 'Generating...' : 'Generate'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <pre className="text-lg font-mono mb-4">{JSON.stringify(result, null, 2)}</pre>
          <button onClick={copyToClipboard} className="bg-green-600 text-white px-4 py-2 rounded">
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  )
}
