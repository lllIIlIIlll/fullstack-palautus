const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./test_helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testi Käyttäjä',
        username: 'testi',
        password: 'salasana'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Toinen Käyttäjä',
        username: 'toinen',
        password: 'salasana'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  describe('Login', () => {

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testi', 'wrong')
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testi', 'salasana')
      await expect(page.getByText('Testi Käyttäjä logged in')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testi', 'salasana')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {title: 'new blog can be created', author: 'playwright', url: 'http://localhost:5173'})
      await expect(page.getByText('new blog can be created playwright')).toBeVisible()
    })

    describe('Liking a blog', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {title: 'blog can be liked', author: 'playwright', url: 'http://localhost:5173'})
        await createBlog(page, {title: 'most liked blog', author: 'playwright', url: 'http://localhost:5173'})
        await createBlog(page, {title: 'least liked blog', author: 'playwright', url: 'http://localhost:5173'})

      })

      test('blog can be liked', async ({ page }) => {
        const buttons = page.locator('button[data-testid="view-btn"]')
        await buttons.nth(0).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('blogs are ranked by likes', async ({ page }) => {
        const viewButtons = page.locator('button[data-testid="view-btn"]')
        await viewButtons.nth(0).click()
        await page.locator('button[data-testid="like-btn"]').click()
        await page.getByRole('button', { name: 'hide' }).click()


        await viewButtons.nth(1).click()
        for (let i = 0; i < 3; i++) {
          await page.locator('button[data-testid="like-btn"]').click()
        }
        await page.getByRole('button', { name: 'hide' }).click()

        const viewButtonsAfterLiking = page.locator('button[data-testid="view-btn"]')
        await viewButtonsAfterLiking.nth(0).click()
        expect(page.getByText('most like blog playwright'))
        await page.getByRole('button', { name: 'hide' }).click()

        await viewButtonsAfterLiking.nth(1).click()
        expect(page.getByText('blog can be liked playwright'))
        await page.getByRole('button', { name: 'hide' }).click()

        await viewButtonsAfterLiking.nth(2).click()
        expect(page.getByText('least liked blog playwright'))
      })
    })

    describe('Deleting a blog', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {title: 'user can delete own blog but not others', author: 'playwright', url: 'http://localhost:5173'})
      })

      test('user can delete own blog', async ({ page }) => {
        page.on('dialog', async dialog => {
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('user can delete own blog but not others playwright')).not.toBeVisible()
      })
  
      test('only user that has added blog sees the remove option', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'toinen', 'salasana')
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeHidden()
      })
    })
  })
})