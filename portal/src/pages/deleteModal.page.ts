import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";


export class DeleteModal extends BasePage {
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;
    readonly modal: Locator;

    constructor(page: Page) {
        super(page);
        this.modal = page.locator(".modal-content");
        this.confirmButton = page.locator("button:has-text('Yes, Delete')");
        this.cancelButton = page.locator("button:has-text('Cancel')")
    }

    async confirmDelete() {
        await this.confirmButton.click();
        await this.modal.waitFor({ state: "detached" });
    }

    async cancelDelete() {
        await this.cancelButton.click();
        await this.modal.waitFor({ state: "detached" });
    }
}