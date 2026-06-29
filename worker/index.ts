// Cloudflare Worker entrypoint: serves the static PWA (via the ASSETS binding)
// and the three API routes. Reuses the same handlers as the Pages Functions.
import { onRequestPost as authPost } from '../functions/api/auth'
import { onRequestGet as contentGet } from '../functions/api/content'
import { onRequestPost as assistantPost } from '../functions/api/assistant'
import type { Env as ApiEnv } from '../functions/_shared/http'

interface Env extends ApiEnv {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const p = url.pathname

    if (p.startsWith('/api/')) {
      if (p === '/api/auth' && request.method === 'POST') return authPost({ request, env })
      if (p === '/api/content' && request.method === 'GET') return contentGet({ request, env })
      if (p === '/api/assistant' && request.method === 'POST') return assistantPost({ request, env })
      return new Response(JSON.stringify({ error: 'not found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      })
    }

    // Everything else: static assets (SPA fallback handled by not_found_handling).
    return env.ASSETS.fetch(request)
  },
}
