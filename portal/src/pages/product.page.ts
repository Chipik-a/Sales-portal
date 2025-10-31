import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ProductsPage extends BasePage {
  readonly uniqueElement: Locator;
  readonly addProductButton: Locator;
  readonly nameInput: Locator;
  readonly priceInput: Locator;
  readonly saveButton: Locator;
  readonly firstRow: Locator;
  readonly toastMessage: Locator;
  readonly manufacturerSelect: Locator;
  readonly amountInput: Locator;

  constructor(page: Page) {
    super(page);
    //this.uniqueElement = page.locator(".products-title");
    this.uniqueElement = page.locator("h2.fw-bold")
    this.addProductButton = page.locator("[name='add-button']");
    this.nameInput = page.locator("#inputName");
    this.priceInput = page.locator("#inputPrice");
    this.saveButton = page.locator("#save-new-product");
    this.firstRow = page.locator("table tbody tr:first-child");
    this.toastMessage = page.locator(".toast-body");
    this.manufacturerSelect = page.locator("#inputManufacturer");
    this.amountInput = page.locator("#inputAmount");

  }

  async addProduct(name: string, manufacturer: string, price: string, amount: string) {
    await this.addProductButton.click();
    await this.nameInput.fill(name);
    await this.manufacturerSelect.selectOption(manufacturer);
    await this.priceInput.fill(price);
    await this.amountInput.fill(amount);
    await this.saveButton.click();
  }

  async verifyFirstRow(name: string, price: string) {
  const firstRow = this.page.locator("table tbody tr:first-child");

  await expect(firstRow.locator("td").nth(0)).toHaveText(name);

  await expect(firstRow.locator("td").nth(1)).toHaveText(`$${price}`);
}

}

//add