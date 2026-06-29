import { type Env, json } from '../_shared/http'
import { verifyCode, issueToken } from '../_shared/crypto'
import { publicContent } from '../_shared/content'

// Public showcase: with no valid personal code the app opens as a demo attendee
// so anyone with the link can explore. (The production app gates on a personal
// `?c=` code instead — see README.) All member data here is fictional.
const DEMO_MEMBER_ID = 'elizabeth-bennet'
const demoMember = () =>
  publicContent.members.some((m) => m.id === DEMO_MEMBER_ID)
    ? DEMO_MEMBER_ID
    : (publicContent.members[0]?.id ?? DEMO_MEMBER_ID)

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> => {
  if (!env.SERVER_SECRET) return json({ error: 'server misconfigured' }, 500)
  let code = ''
  let demo = false
  try {
    const body = (await request.json()) as { code?: string; demo?: boolean }
    code = (body.code || '').trim()
    demo = body.demo === true
  } catch {
    /* ignore */
  }

  // Personal code takes precedence; fall back to a demo session if requested.
  let memberId = code ? await verifyCode(env.SERVER_SECRET, code) : null
  if (!memberId && demo) memberId = demoMember()
  if (!memberId) return json({ error: code ? 'invalid code' : 'missing code' }, code ? 401 : 400)

  const token = await issueToken(env.SERVER_SECRET, memberId)
  return json({ token, memberId })
}
