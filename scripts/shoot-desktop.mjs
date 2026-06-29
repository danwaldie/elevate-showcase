import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.argv[2] || 'http://localhost:5174'
const OUT = '.shots'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 })
const shoot = async (name) => {
  await page.waitForTimeout(350)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot', name)
}

try {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByText('Enter the Retreat').waitFor({ timeout: 10000 })
  await shoot('d-01-welcome')

  await page.getByText('Enter the Retreat').click()
  await page.getByRole('heading', { name: 'Directory' }).waitFor({ timeout: 10000 })
  await shoot('d-02-directory')

  await page.getByText('Aaron Archer').first().click()
  await page.waitForTimeout(400)
  await shoot('d-03-profile-pane')

  await page.getByText('Schedule', { exact: true }).first().click()
  await page.getByRole('heading', { name: 'Schedule' }).waitFor({ timeout: 10000 })
  await page.getByText('Wed 22').click()
  await shoot('d-04-schedule')

  await page.getByText('Forum', { exact: true }).first().click()
  await page.waitForTimeout(400)
  await shoot('d-05-session-pane')

  await page.getByText('Map', { exact: true }).first().click()
  await page.getByRole('heading', { name: 'Map' }).waitFor({ timeout: 10000 })
  await page.getByText('Main Cottage', { exact: true }).first().click()
  await shoot('d-06-map')

  await page.getByText('Concierge', { exact: true }).first().click()
  await page.waitForTimeout(300)
  await page.evaluate(() => {
    const store = window.__store
    if (store)
      store.setState({
        chat: [
          { role: 'user', text: 'Who can help with fundraising?' },
          {
            role: 'assistant',
            text: 'A few people who are sharp on fundraising and can open doors:',
            recommendations: [
              { memberId: 'nadia-khan', reason: 'Leads seed rounds in climate, fintech & AI' },
              { memberId: 'aaron-archer', reason: 'Term sheets & venture financings' },
            ],
          },
        ],
      })
  })
  await shoot('d-07-concierge')

  console.log('OK')
} catch (e) {
  console.error('FAILED -', e.message)
  await page.screenshot({ path: `${OUT}/d-error.png` }).catch(() => {})
} finally {
  await browser.close()
}
