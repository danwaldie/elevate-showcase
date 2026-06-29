import { type Env, json, requireViewer } from '../_shared/http'
import { publicContent } from '../_shared/content'

export const onRequestGet = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> => {
  const viewer = await requireViewer(request, env)
  if (!viewer) return json({ error: 'unauthorized' }, 401)
  // Public, gated content only — private notes are never included here.
  return json(publicContent, 200, { 'cache-control': 'private, no-store' })
}
