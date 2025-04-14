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
        this.dropdown = page.locator('select[name="dropdown"]');
        this.submitButton = page.locator('input[type="submit"]');
    }

    async goto() {
        await this.page.goto('basic-html-form-test.html');
    }

    async fillForm({
        username,
        password,
        comments,
        checkboxIndex,
        radioIndex,
        dropdownValue,
        multiSelectValues
    }: {
        username?: string;
        password?: string;
        comments?: string;
        checkboxIndex?: number;
        radioIndex?: number;
        dropdownValue?: string;
        multiSelectValues?: string[];
    }) {
        if (username) await this.usernameInput.fill(username);
        if (password) await this.passwordInput.fill(password);
        if (comments) await this.commentsTextarea.fill(comments);
        if (checkboxIndex !== undefined) await this.checkboxItems.nth(checkboxIndex).check();
        if (radioIndex !== undefined) await this.radioItems.nth(radioIndex).check();
        if (dropdownValue) await this.dropdown.selectOption(dropdownValue);
        if (multiSelectValues) await this.multipleSelect.selectOption(multiSelectValues);
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
        if (formData.username) {
            await expect(this.usernameInput).toHaveValue(formData.username);
        }
        if (formData.password) {
            await expect(this.passwordInput).toHaveValue(formData.password);
        }
        if (formData.comments) {
            await expect(this.commentsTextarea).toHaveValue(formData.comments);
        }
        if (typeof formData.checkboxIndex === 'number') {
            await expect(this.checkboxItems.nth(formData.checkboxIndex)).toBeChecked();
        }
        if (typeof formData.radioIndex === 'number') {
            await expect(this.radioItems.nth(formData.radioIndex)).toBeChecked();
        }
    }
}