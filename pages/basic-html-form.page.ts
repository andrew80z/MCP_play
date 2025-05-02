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
import { Page, Locator, expect } from '@playwright/test';

export class BasicHtmlFormPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly commentsTextarea: Locator;
  readonly fileUpload: Locator;
  readonly checkboxItems: Locator;
  readonly radioItems: Locator;
  readonly multipleSelect: Locator;
  readonly dropdown: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.commentsTextarea = page.locator('textarea[name="comments"]');
    this.fileUpload = page.locator('input[name="filename"]');
    this.checkboxItems = page.locator('input[type="checkbox"]');
    this.radioItems = page.locator('input[type="radio"]');
    this.multipleSelect = page.locator('select[multiple="multiple"]');
    this.dropdown = page.locator('[name="dropdown"]');
    this.submitButton = page.locator('input[type="submit"]');
  }

  async goto() {
    await this.page.goto(`/styled/basic-html-form-test.html`);
  }

  async ensurePageIsLoaded() {
    await this.page.waitForLoadState('load');
    await this.page.waitForSelector('form'); // Ensure the form is present on the page
  }

  async fillForm(formData: {
    username?: string;
    password?: string;
    comments?: string;
    checkboxIndex?: number;
    radioIndex?: number;
    dropdownValue?: string;
    multiSelectValues?: string[];
  }) {
    const actions = [
      { key: 'username', action: async () => await this.usernameInput.fill(formData.username!) },
      { key: 'password', action: async () => await this.passwordInput.fill(formData.password!) },
      { key: 'comments', action: async () => await this.commentsTextarea.fill(formData.comments!) },
      { key: 'checkboxIndex', action: async () => await this.checkboxItems.nth(formData.checkboxIndex!).check() },
      { key: 'radioIndex', action: async () => await this.radioItems.nth(formData.radioIndex!).check() },
      { key: 'dropdownValue', action: async () => await this.selectDropdownValue(formData.dropdownValue!) },
      { key: 'multiSelectValues', action: async () => await this.multipleSelect.selectOption(formData.multiSelectValues!) },
    ];

    for (const { key, action } of actions) {
      if (formData[key as keyof typeof formData] !== undefined)
        await action();
    }
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async verifyFormValues(formData: {
    username?: string;
    password?: string;
    comments?: string;
    checkboxIndex?: number;
    radioIndex?: number;
    dropdownValue?: string;
    multiSelectValues?: string[];
  }) {
    if (formData.username)
      await expect(this.usernameInput).toHaveValue(formData.username);

    if (formData.password)
      await expect(this.passwordInput).toHaveValue(formData.password);

    if (formData.comments)
      await expect(this.commentsTextarea).toHaveValue(formData.comments);

    if (typeof formData.checkboxIndex === 'number')
      await expect(this.checkboxItems.nth(formData.checkboxIndex)).toBeChecked();

    if (typeof formData.radioIndex === 'number')
      await expect(this.radioItems.nth(formData.radioIndex)).toBeChecked();
  }

  async waitForDropdownOptions() {
    await this.page.waitForSelector('select[name="dropdown"] option', { state: 'attached' });
  }

  async waitForDropdownToBeEnabled() {
    const dropdown = this.page.locator('select[name="dropdown"]');
    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.waitFor({ state: 'visible' });
    await dropdown.isEnabled();
  }

  async selectDropdownValue(value: string) {
    await this.dropdown.selectOption(value);
  }

  async isAlertTriggered() {
    return await this.page.evaluate(() => {
      let alertTriggered = false;
      window.alert = () => { alertTriggered = true; };
      return alertTriggered;
    });
  }

  async getPasswordFieldContent() {
    return await this.page.locator('[id="_valuepassword"]').innerHTML();
  }

  async getCommentsFieldContent() {
    return await this.page.locator('[id="_valuecomments"]').innerHTML();
  }
}
