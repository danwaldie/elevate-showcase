import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.argv[2] || 'http://localhost:5174'
const OUT = '.shots'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 414, height: 896 },
  deviceScaleFactor: 2,
})
const shots = []
const shoot = async (name) => {
  await page.waitForTimeout(350)
  const path = `${OUT}/${name}.png`
  await page.screenshot({ path })
  shots.push(name)
  console.log('shot', name)
}

try {
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.getByText('Enter the Retreat').waitFor({ timeout: 10000 })
  await shoot('01-welcome')

  await page.getByText('Enter the Retreat').click()
  await page.getByRole('heading', { name: 'Directory' }).waitFor({ timeout: 10000 })
  await shoot('02-directory')

  // sort: your people first (to verify WITH YOU surfacing)
  await page.getByText('Your people first').click()
  await shoot('02b-directory-mine')

  await page.getByText('Aaron Archer').first().click()
  await page.waitForTimeout(400)
  await shoot('03-profile')

  // back, go to Schedule
  await page.getByText('‹ Directory').click()
  await page.getByText('Schedule', { exact: true }).click()
  await page.getByRole('heading', { name: 'Schedule' }).waitFor({ timeout: 10000 })
  await shoot('04-schedule-tue')

  await page.getByText('Wed 22').click()
  await shoot('04b-schedule-wed')

  await page.getByText('Forum', { exact: true }).first().click()
  await page.waitForTimeout(400)
  await shoot('05-session-forum')

  // back to schedule, then to Map via the nav
  await page.getByText('‹ Schedule').click()
  await page.getByText('Map', { exact: true }).click()
  await page.getByRole('heading', { name: 'Map' }).waitFor({ timeout: 10000 })
  await page.waitForTimeout(300)
  await shoot('06-map')

  // tap a venue pin to open the selection card
  await page.getByText('Main Cottage', { exact: true }).first().click()
  await page.waitForTimeout(300)
  await shoot('06b-map-selected')

  await page.getByText('Concierge', { exact: true }).click()
  await shoot('07-concierge')

  // Seed a sample conversation to verify the recommendation cards render.
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
              { memberId: 'priya-nair', reason: 'Fintech-focused GP, writes early cheques' },
            ],
          },
        ],
        input: '',
      })
  })
  await shoot('07b-concierge-chat')

  console.log('OK:', shots.join(', '))
} catch (e) {
  console.error('FAILED at', shots.length ? `after ${shots[shots.length - 1]}` : 'start', '-', e.message)
  await page.screenshot({ path: `${OUT}/error.png` }).catch(() => {})
} finally {
  await browser.close()
}
