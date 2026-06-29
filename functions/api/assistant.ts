import Anthropic from '@anthropic-ai/sdk'
import { type Env, json, requireViewer } from '../_shared/http'
import { publicContent } from '../_shared/content'
import { INSTRUCTIONS, buildSystemContext, buildViewerContext } from '../_shared/assistant-context'

/* eslint-disable @typescript-eslint/no-explicit-any */

const SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          memberId: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['memberId', 'reason'],
        additionalProperties: false,
      },
    },
  },
  required: ['reply', 'recommendations'],
  additionalProperties: false,
}

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> => {
  const viewer = await requireViewer(request, env)
  if (!viewer) return json({ error: 'unauthorized' }, 401)
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'assistant unavailable' }, 503)

  let message = ''
  try {
    const body = (await request.json()) as { message?: string }
    message = (body.message || '').trim()
  } catch {
    /* ignore */
  }
  if (!message) return json({ error: 'missing message' }, 400)

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

  try {
    const resp = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      system: [
        { type: 'text', text: INSTRUCTIONS },
        // Large static block — cached so repeat queries are fast & cheap.
        { type: 'text', text: buildSystemContext(), cache_control: { type: 'ephemeral' } },
      ],
      messages: [
        { role: 'user', content: `${buildViewerContext(viewer)}\n\nQuestion: ${message}` },
      ],
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
    } as any)

    const text =
      (resp as any).content?.find((b: any) => b.type === 'text')?.text ?? '{}'
    let parsed: { reply?: string; recommendations?: { memberId: string; reason: string }[] } = {}
    try {
      parsed = JSON.parse(text)
    } catch {
      /* fall through to defaults */
    }

    const validIds = new Set((publicContent as any).members.map((m: any) => m.id))
    const recommendations = (parsed.recommendations || [])
      .filter((r) => r && validIds.has(r.memberId) && r.memberId !== viewer)
      .slice(0, 5)

    return json({
      reply: parsed.reply || 'Here are a few people I think you should meet.',
      recommendations,
    })
  } catch {
    return json({ error: 'assistant error' }, 502)
  }
}
