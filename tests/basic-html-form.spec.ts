/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import { test as baseTest } from '@playwright/test';
import { BasicHtmlFormPage } from '../pages/basic-html-form.page';
import { TEST_DATA } from './test-data/form-data';

type TestFixtures = {
  formPage: BasicHtmlFormPage;
};

const test = baseTest.extend<TestFixtures>({
  formPage: async ({ page }, use) => {
    const formPage = new BasicHtmlFormPage(page);
    await formPage.goto();
    await use(formPage);
  },
});

test.beforeEach(async ({ formPage }) => {
  await formPage.ensurePageIsLoaded();
});

test('should fill and submit form with all fields', async ({ formPage }) => {
  await formPage.fillForm(TEST_DATA.FULL_FORM);
  await formPage.verifyFormValues(TEST_DATA.FULL_FORM);
  await formPage.submitForm();
});

test('should submit form with minimal required fields', async ({ formPage }) => {
  await formPage.fillForm(TEST_DATA.MINIMAL_FORM);
  await formPage.verifyFormValues(TEST_DATA.MINIMAL_FORM);
  await formPage.submitForm();
});
