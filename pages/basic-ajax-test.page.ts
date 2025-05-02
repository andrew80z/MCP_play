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