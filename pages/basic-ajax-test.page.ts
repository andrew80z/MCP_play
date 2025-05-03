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
import { Page } from '@playwright/test';

export class BasicAjaxTestPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(`/basic-ajax-test.html`);
  }

  async selectCategory(category: string) {
    await this.page.selectOption('#combo1', category);
  }

  async getOptionsForCategory() {
    return this.page.locator('#combo2 option').allTextContents();
  }

  async submitForm() {
    await this.page.click('#ajaxButton');
  }

  async getResultText() {
    return this.page.locator('#_id').textContent();
  }
}
