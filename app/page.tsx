'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Copy, Zap, Loader2, Zap as Model } from 'lucide-react'

type EnhancementMode = 'detailed' | 'concise' | 'creative' | 'technical' | 'structured'

interface EnhancedPrompt {
  original: string
  enhanced: string
  mode: EnhancementMode
  model: string
}

const MODELS = [
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', price: '$0.008/M', rating: '⭐⭐⭐⭐⭐' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', price: 'FREE', rating: '⭐⭐⭐⭐' },
  { id: 'qwen/qwen3.7-max', name: 'Qwen 3.7 Max', price: 'Cheap', rating: '⭐⭐⭐⭐⭐' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', price: '$3/M', rating: '⭐⭐⭐⭐⭐' },
  { id: 'grok/grok-4.1-fast', name: 'Grok 4.1 Fast', price: 'Affordable', rating: '⭐⭐⭐⭐⭐' },
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-6 h-6 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">Prompt Enhancer</h1>
          </div>
          <p className="text-zinc-400">Transform rough ideas into professional, high-end prompts</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Your Idea</h2>
                <Textarea
                  placeholder="Describe what you want to achieve... be as vague or specific as you like"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-48 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>

              {/* Model Selection */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">AI Model</h3>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm"
                >
                  {MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} • {model.price} {model.rating}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enhancement Mode Selection */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Enhancement Style</h3>
                <div className="grid grid-cols-2 gap-2">
                  {modes.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value)}
                      className={`p-2 rounded-lg text-sm transition-colors ${
                        mode === m.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      <div className="font-medium">{m.label}</div>
                      <div className="text-xs opacity-75">{m.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Enhance Button */}
              <Button
                onClick={enhance}
                disabled={loading || !input.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Enhance Prompt
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            {result ? (
              <div className="space-y-4 h-full flex flex-col">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">Enhanced Prompt</h2>
                  <div className="p-3 bg-zinc-800 rounded-lg text-white text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-48">
                    {result.enhanced}
                  </div>
                </div>

                {/* Copy Button */}
                <Button
                  onClick={copyToClipboard}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {copied ? (
                    <>✓ Copied!</>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>

                {/* Comparison Toggle */}
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-zinc-400 hover:text-zinc-300">
                    View Original →
                  </summary>
                  <div className="mt-3 p-3 bg-zinc-800 rounded-lg text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {result.original}
                  </div>
                </details>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <p className="text-zinc-500">
                  {loading ? 'Enhancing your prompt...' : 'Enhanced prompt will appear here'}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
