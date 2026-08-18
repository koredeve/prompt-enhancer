'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Sparkles, Loader2, ArrowRight } from 'lucide-react'

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

  const modes: { value: EnhancementMode; label: string }[] = [
    { value: 'detailed', label: 'Detailed' },
    { value: 'concise', label: 'Concise' },
    { value: 'creative', label: 'Creative' },
    { value: 'technical', label: 'Technical' },
    { value: 'structured', label: 'Structured' },
  ]

  const enhance = async () => {
    if (!input.trim()) {
      setError('Enter a prompt')
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

      if (!response.ok) throw new Error('Failed to enhance')

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
    if (e.key === 'Enter' && e.ctrlKey) enhance()
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur border border-blue-400/30">
              <Sparkles className="w-6 h-6 text-blue-300" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              PromptPolish
            </h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base">Refine your prompts with intelligent AI</p>
        </div>

        {/* Main Container */}
        <div className="space-y-6">
          {/* Input Card - Glassmorphism */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300">
              <Textarea
                placeholder="Paste your scattered prompt here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full min-h-36 sm:min-h-44 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 text-base resize-none focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all mb-6"
              />

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as EnhancementMode)}
                  className="px-4 py-2.5 bg-white/10 border border-white/10 text-white text-sm rounded-lg focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all backdrop-blur"
                >
                  {modes.map((m) => (
                    <option key={m.value} value={m.value} className="bg-slate-900">
                      {m.label}
                    </option>
                  ))}
                </select>

                <Button
                  onClick={enhance}
                  disabled={loading || !input.trim()}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium gap-2 rounded-lg px-6 py-2.5 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Polishing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">Polish</span>
                      <span className="sm:hidden">Polish</span>
                    </>
                  )}
                </Button>
              </div>

              {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
              {!result && <p className="text-slate-500 text-xs mt-3">⌨️ Ctrl+Enter to submit</p>}
            </div>
          </div>

          {/* Output Card - Glassmorphism */}
          {result && (
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300">
                {/* Enhanced Prompt */}
                <div className="mb-6 p-5 sm:p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-xl">
                  <p className="text-white text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {result.enhanced}
                  </p>
                </div>

                {/* Copy Button */}
                <Button
                  onClick={copyToClipboard}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium gap-2 rounded-lg py-2.5 sm:py-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25"
                >
                  {copied ? (
                    <>
                      <span>✓ Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
