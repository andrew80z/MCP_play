/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { test } from './fixtures/screenshot.fixture';
import { BasicAjaxTestPage } from '../pages/basic-ajax-test.page';

let ajaxPage: BasicAjaxTestPage;

test.beforeEach(async ({ page }) => {
  ajaxPage = new BasicAjaxTestPage(page);
  await ajaxPage.goto();
});
test.describe('Basic Ajax Test', () => {
  test('should display options for selected category', async ({ page }) => {
    const categories = ['2', 'Flash'];
    await ajaxPage.selectCategory('2'); // Select category with value 2
    const options = await ajaxPage.getOptionsForCategory();
    test.expect(options).toContain(categories[1]); // Positive test
  });

  test('should not display options for invalid category', async ({ page }) => {
    const options = await ajaxPage.getOptionsForCategory();
    test.expect(options).not.toContain('invalid'); // Negative test
  });

  test('should submit form and display result', async ({ page }) => {
    const category = '2';
    await ajaxPage.selectCategory(category);
    await ajaxPage.submitForm();
    const resultText = await ajaxPage.getIdText();
    test.expect(resultText).toContain(category);
  });
});
