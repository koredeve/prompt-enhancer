'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Copy, Sparkles, Loader2, Zap } from 'lucide-react'

type EnhancementMode = 'detailed' | 'concise' | 'creative' | 'technical' | 'structured'

interface EnhancedPrompt {
  original: string
  enhanced: string
  mode: EnhancementMode
  usedModel: string
}

export default function Home() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<EnhancementMode>('detailed')
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
        body: JSON.stringify({ prompt: input, mode }),
      })

      if (!response.ok) {
        throw new Error('Failed to enhance prompt')
      }

      const data = await response.json()
      setResult({
        original: input,
        enhanced: data.enhanced,
        mode,
        usedModel: data.usedModel || 'AutoRouter',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      enhance()
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
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">PromptPolish</h1>
          </div>
          <p className="text-sm text-zinc-400">Refine your prompts with AI</p>
        </div>

        {/* Main Input */}
        <Card className="bg-zinc-900/50 border border-zinc-800 p-6 mb-6">
          <Textarea
            placeholder="Paste your prompt idea here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-40 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 text-base resize-none mb-4"
          />

          {/* Controls Row */}
          <div className="flex gap-3 items-center">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as EnhancementMode)}
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 text-white text-sm rounded"
            >
              {modes.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <Button
              onClick={enhance}
              disabled={loading || !input.trim()}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Polishing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Polish
                </>
              )}
            </Button>
          </div>

          {error && <div className="text-red-400 text-xs mt-3">{error}</div>}
          {!result && <p className="text-xs text-zinc-500 mt-2">💡 Tip: Press Ctrl+Enter to submit</p>}
        </Card>

        {/* Output */}
        {result && (
          <Card className="bg-gradient-to-br from-blue-950/30 to-zinc-900/30 border border-blue-800/30 p-6">
            <div className="p-4 bg-zinc-800/50 rounded-lg text-white text-sm leading-relaxed whitespace-pre-wrap border border-zinc-700 mb-4">
              {result.enhanced}
            </div>
            <Button
              onClick={copyToClipboard}
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              {copied ? (
                <>✓ Copied</>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
