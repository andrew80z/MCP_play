/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import { test as base } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { BasicHtmlFormPage } from '../../pages/basic-html-form.page';

export type TestFixtures = {
  screenshotOnFailure: void;
  formPage: BasicHtmlFormPage;
};

export const test = base.extend<TestFixtures>({
  screenshotOnFailure: [async ({ }, use, testInfo) => {
    await use();
    const testFailed = testInfo.status !== testInfo.expectedStatus;

    if (testFailed) {
      const screenshotPath = testInfo.outputPath('failure.png');
      if (testInfo.retry === testInfo.project.retries) {
        const screenshotName = `${path.basename(testInfo.file, '.spec.ts')}-${testInfo.title.replace(/\s+/g, '-')}-${testInfo.project.name}`;
        const targetDir = path.join(testInfo.outputDir, screenshotName);

        if (!fs.existsSync(targetDir))
          fs.mkdirSync(targetDir, { recursive: true });

        const attachmentsDir = path.join(targetDir, 'attachments');
        if (!fs.existsSync(attachmentsDir))
          fs.mkdirSync(attachmentsDir, { recursive: true });

        if (fs.existsSync(screenshotPath))
          fs.copyFileSync(screenshotPath, path.join(attachmentsDir, 'failure.png'));
      }
    }
  }, { auto: true }],
  formPage: async ({ page }, use) => {
    const formPage = new BasicHtmlFormPage(page);
    await formPage.goto();
    await use(formPage);
  },
});
