import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { SALES_PORTAL_URL } from "../config/env";

export class SignInPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly spinner: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.locator('#emailinput');
        this.passwordInput = page.locator('#passwordinput');
        this.loginButton = page.locator('button[type="submit"]');
        this.spinner = this.page.locator('.spinner-border');
    }

    async fillCredentials(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async waitForLoaded() {
        await this.spinner.first().waitFor({ state: 'hidden' });
    }

    async open() {
        await this.page.goto(`${SALES_PORTAL_URL}#/login`);
    }
}

//add