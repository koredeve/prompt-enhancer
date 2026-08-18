# Prompt Enhancer ⚡

A beautiful, powerful web app that transforms rough ideas into professional, high-end prompts powered by Claude AI.

## Features

✨ **Multiple Enhancement Modes:**
- **Detailed** - Comprehensive and thorough with examples and edge cases
- **Concise** - Short, direct, gets straight to the point
- **Creative** - With personality, storytelling, and imagination
- **Technical** - Precise for code generation and engineering
- **Structured** - Clear sections: Context, Task, Constraints, Output, Examples

🎯 **Beautiful UI:**
- Dark theme optimized for focus and reduced eye strain
- Real-time prompt enhancement
- One-click copy to clipboard
- Side-by-side original/enhanced comparison

⚡ **Modern Stack:**
- Next.js 16 with Turbopack
- React 19 with hooks
- Tailwind CSS + shadcn/ui
- AI SDK + Claude 3.5 Sonnet

## Quick Start

### 1. Setup API Key

Get your free API key from [console.anthropic.com](https://console.anthropic.com)

```bash
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
```

### 2. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## How It Works

1. **Describe your goal** - Be vague or specific, doesn't matter
2. **Pick an enhancement style** - Choose the mode that fits
3. **Click Enhance** - Claude transforms it into a pro prompt
4. **Copy & use** - One-click copy to clipboard

## Deploy to Vercel

```bash
vercel
```

Then add `ANTHROPIC_API_KEY` to environment variables in Vercel dashboard.

**That's it!** Your prompt enhancer is live. 🚀

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Claude 3.5 Sonnet](https://www.anthropic.com/claude) - AI backbone
- [AI SDK](https://sdk.vercel.ai/) - LLM integration
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## License

MIT - Use freely!
