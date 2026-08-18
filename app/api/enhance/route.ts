import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

type EnhancementMode = 'detailed' | 'concise' | 'creative' | 'technical' | 'structured'

const modePrompts: Record<EnhancementMode, string> = {
  detailed:
    'Transform this into a comprehensive, detailed prompt with clear instructions, examples, and edge cases. Include context and expectations.',
  concise:
    'Transform this into a short, direct prompt that gets straight to the point. Remove unnecessary words while keeping the core intent.',
  creative:
    'Transform this into a creative prompt with personality and storytelling. Make it engaging and imaginative.',
  technical:
    'Transform this into a technical prompt suitable for engineering or code generation. Be precise with technical terminology.',
  structured:
    'Transform this into a structured prompt with clear sections: Context, Task, Constraints, Expected Output, and Examples.',
}

export async function POST(request: Request) {
  try {
    const { prompt, mode = 'detailed', model = 'deepseek/deepseek-chat' } = (await request.json()) as {
      prompt: string
      mode: EnhancementMode
      model: string
    }

    if (!prompt || prompt.trim().length === 0) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 },
      )
    }

    const openrouter = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    })

    const systemPrompt = `You are an expert prompt engineer. Your job is to take user ideas and transform them into high-quality, professional prompts that will get excellent results from AI models.

${modePrompts[mode]}

Guidelines:
- Be clear and specific
- Provide context when helpful
- Suggest relevant format for the output
- Include any necessary constraints or requirements
- Make the prompt actionable and complete

Return ONLY the enhanced prompt, nothing else.`

    const { text } = await generateText({
      model: openrouter(model),
      system: systemPrompt,
      prompt: `Original idea/prompt:\n\n${prompt}`,
    })

    return Response.json({ enhanced: text })
  } catch (error) {
    console.error('Enhancement error:', error)
    return Response.json(
      { error: 'Failed to enhance prompt' },
      { status: 500 },
    )
  }
}
