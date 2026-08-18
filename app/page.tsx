'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Copy, Sparkles, Loader2 } from 'lucide-react'

type EnhancementMode = 'detailed' | 'concise' | 'creative' | 'technical' | 'structured'

interface EnhancedPrompt {
  original: string
  enhanced: string
  mode: EnhancementMode
  model: string
}

const MODELS = [
  { id: 'openrouter/auto-beta', name: 'AutoRouter (Smart)' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Free)' },
  { id: 'qwen/qwen3.7-max', name: 'Qwen 3.7 Max' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
]

export default function Home() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<EnhancementMode>('detailed')
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EnhancedPrompt | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const modes: { value: EnhancementMode; label: string; description: string }[] = [
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive and thorough' },
    { value: 'concise', label: 'Concise', description: 'Short and direct' },
    { value: 'creative', label: 'Creative', description: 'With personality' },
    { value: 'technical', label: 'Technical', description: 'For code/engineering' },
    { value: 'structured', label: 'Structured', description: 'Clear sections' },
  ]

  const enhance = async () => {
    if (!input.trim()) {
      setError('Please enter some text')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, mode, model: selectedModel }),
      })

      if (!response.ok) {
        throw new Error('Failed to enhance prompt')
      }

      const data = await response.json()
      setResult({
        original: input,
        enhanced: data.enhanced,
        mode,
        model: selectedModel,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.enhanced)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError('Failed to copy')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">PromptPolish</h1>
          </div>
          <p className="text-sm text-zinc-500">Refine your prompts instantly</p>
        </div>

        <div className="space-y-6">
        {/* Input */}
        <Card className="bg-zinc-900 border-zinc-800 p-6">
          <Textarea
            placeholder="Enter your prompt idea..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-32 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 mb-4"
          />

          {/* Controls */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-xs text-zinc-400 mb-1 block">Style</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as EnhancementMode)}
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white text-sm"
              >
                {modes.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-xs text-zinc-400 mb-1 block">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white text-sm"
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={enhance}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            </Button>
          </div>

          {error && <div className="text-red-400 text-sm mt-3">{error}</div>}
        </Card>

        {/* Output */}
        {result && (
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="p-4 bg-zinc-800 rounded text-white text-sm leading-relaxed mb-4 whitespace-pre-wrap">
              {result.enhanced}
            </div>
            <Button
              onClick={copyToClipboard}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {copied ? '✓ Copied!' : <><Copy className="w-4 h-4 mr-2" /> Copy</>}
            </Button>
          </Card>
        )}
        </div>
      </div>
    </div>
  )
}
