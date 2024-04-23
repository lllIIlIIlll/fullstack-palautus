const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, fields) => {
	await page.getByRole('button', { name: 'new blog' }).click()
	const textboxes = await page.getByRole('textbox').all()
	await textboxes[0].fill(fields.title)
	await textboxes[1].fill(fields.author)
	await textboxes[2].fill(fields.url)
	await page.getByRole('button', { name: 'create' }).click()
	await page.getByText(`${fields.title} ${fields.author}`).waitFor()
}
    
export { loginWith, createBlog }