import { test } from './fixtures/screenshot.fixture';
import { BasicHtmlFormPage } from '../pages/basic-html-form.page';
import { TEST_DATA } from './test-data/form-data';

let formPage: BasicHtmlFormPage;

test.beforeEach(async ({ page }) => {
    formPage = new BasicHtmlFormPage(page);
    await formPage.goto();
});

test('should fill and submit form with all fields', async ({ page }) => {
    await formPage.fillForm(TEST_DATA.FULL_FORM);
    await formPage.verifyFormValues(TEST_DATA.FULL_FORM);
    await formPage.submitForm();
});

test('should submit form with minimal required fields', async ({ page }) => {
    await formPage.fillForm(TEST_DATA.MINIMAL_FORM);
    await formPage.verifyFormValues(TEST_DATA.MINIMAL_FORM);
    await formPage.submitForm();
});