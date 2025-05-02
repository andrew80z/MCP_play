import { test } from './fixtures/screenshot.fixture';
import { BasicAjaxTestPage } from '../pages/basic-ajax-test.page';

let ajaxPage: BasicAjaxTestPage;

test.beforeEach(async ({ page }) => {
  ajaxPage = new BasicAjaxTestPage(page);
  await ajaxPage.goto();
});

test('should display options for selected category', async ({ page }) => {
  await ajaxPage.selectCategory('2'); // Select category with value 2
  const options = await ajaxPage.getOptionsForCategory();
  test.expect(options).toContain('Option 2.1'); // Positive test
});

test('should not display options for invalid category', async ({ page }) => {
  await ajaxPage.selectCategory('invalid'); // Select invalid category
  const options = await ajaxPage.getOptionsForCategory();
  test.expect(options).toEqual([]); // Negative test
});

test('should submit form and display result', async ({ page }) => {
  await ajaxPage.selectCategory('2');
  await ajaxPage.submitForm();
  const resultText = await ajaxPage.getResultText();
  test.expect(resultText).toContain('Submitted OK'); // Positive test
});

