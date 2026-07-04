import { expect, test } from '@playwright/test'

test('user can log in and reach the dashboard', async ({ page }) => {
  await page.goto('/auth/login')

  await page.getByLabel('Email').fill('jane.doe@qurium.dev')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: 'Log in' }).click()

  await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible()
})
