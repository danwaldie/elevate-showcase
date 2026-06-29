import { verifyToken } from './crypto'

export interface Env {
  SERVER_SECRET: string
  ANTHROPIC_API_KEY: string
}

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  })
}

export function bearer(request: Request): string | null {
  const h = request.headers.get('authorization') || ''
  const m = /^Bearer\s+(.+)$/i.exec(h)
  return m ? m[1] : null
}

/** Returns the authenticated member id, or null if the request has no valid token. */
export async function requireViewer(request: Request, env: Env): Promise<string | null> {
  if (!env.SERVER_SECRET) return null
  const token = bearer(request)
  if (!token) return null
  return verifyToken(env.SERVER_SECRET, token)
}
