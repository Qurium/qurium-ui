import { expect, test } from '@playwright/test'

test('visiting the app lands on the schema explorer', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Schema Explorer' }),
  ).toBeVisible()
  await expect(page.getByText('users').first()).toBeVisible()
})
