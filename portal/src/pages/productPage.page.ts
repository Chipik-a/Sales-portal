import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { DeleteModal } from "./deleteModal.page";
import { IProduct } from "../../src/data/types/product.types";
import { NOTIFICATIONS } from "../data/salesPortal/notifications";

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
  readonly formTitle: Locator;

  constructor(page: Page) {
    super(page);
    //this.uniqueElement = page.locator(".products-title");
    this.uniqueElement = page.locator("h2.fw-bold");
    this.addProductButton = this.page.locator('[name="add-button"]');
    //this.addProductButton = page.locator("[name='add-button']");
    this.nameInput = page.locator("#inputName");
    this.priceInput = page.locator("#inputPrice");
    this.saveButton = page.locator("#save-new-product");
    this.firstRow = page.locator("table tbody tr:first-child");
    this.toastMessage = page.locator(".toast-body");
    this.manufacturerSelect = page.locator("#inputManufacturer");
    this.amountInput = page.locator("#inputAmount");
    this.formTitle = page.locator('#title');

  }
  static toastMessage(toastMessage: any) {
    throw new Error("Method not implemented.");
  }

    async navigateToAddNewProduct() {
    await this.addProductButton.waitFor({ state: "visible", timeout: 15000 });
    await this.addProductButton.scrollIntoViewIfNeeded();
    await this.addProductButton.click({ force: true });

    // const freshButton = this.page.locator('a:has-text("Add Product")');
    // await freshButton.click({ force: true });

    await this.page.waitForURL("**/products/add", { timeout: 10000 });
    await expect(this.formTitle).toBeVisible();
  }

  // async navigateToAddNewProduct() {
  //   await this.addProductButton.click();
  //   await expect(this.formTitle).toBeVisible();
  // }

  async addProduct(product: IProduct) {
    //await this.navigateToAddNewProduct();
    // await this.addProductButton.click({ force: true });
    // await expect(this.formTitle).toBeVisible();
    await expect(this.nameInput).toBeVisible({ timeout: 5000 });
    await this.nameInput.fill(product.name);
    await this.manufacturerSelect.selectOption(product.manufacturer);
    await this.priceInput.fill(String(product.price));
    await this.amountInput.fill(String(product.amount));
    await this.saveButton.click();

     await expect(this.toastMessage).toHaveText(NOTIFICATIONS.PRODUCT_CREATED);
  }

  async verifyFirstRow(name: string, price: string) {
  const firstRow = this.page.locator("table tbody tr:first-child");
  await expect(firstRow.locator("td").nth(0)).toHaveText(name);
  await expect(firstRow.locator("td").nth(1)).toHaveText(`$${price}`);
}

  async deleteProduct(name: string) {
    const row = this.page.locator(`table tbody tr:has-text("${name}")`);
    await expect(row).toBeVisible();

    await row.locator("button[title='Delete']").click();

    const modal = new DeleteModal(this.page);
    await modal.confirmDelete();

     await expect(this.page.locator(`table tbody tr:has-text("${name}")`)).toHaveCount(0);
  }

  async verifyProductNotInTable(name: string) {
  await expect(this.page.locator(`table tbody tr:has-text("${name}")`)).toHaveCount(0);
}

}

