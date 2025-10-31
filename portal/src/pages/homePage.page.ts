import { Locator } from "@playwright/test";
import { BasePage } from "./base.page";

type HomeButton = "Products" | "Customers" | "Orders";

export class HomePage extends BasePage {
  readonly welcomeText = this.page.locator(".welcome-text");
  readonly productsButton = this.page.locator("#products-from-home");
  readonly customersButton = this.page.locator("#customers-from-home");
  readonly ordersButton = this.page.locator("#orders-from-home");
  readonly uniqueElement = this.welcomeText;

  async clickOnViewModule(module: HomeButton) {
    const moduleButtons: Record<HomeButton, Locator> = {
      Products: this.productsButton,
      Customers: this.customersButton,
      Orders: this.ordersButton,
    };

    await moduleButtons[module].click();
  }
}

//add