import { test, expect } from "@playwright/test";
import { SignInPage } from "../../src/pages/signInPage.page";
import { HomePage } from "../../src/pages/homePage.page";
import { ProductsPage } from "../../src/pages/productPage.page";
import { credentials } from "../../config/env";
import { generateProductData } from "../../src/data/salesPortal/products/generateProductData";
import dotenv from "dotenv";

dotenv.config();

test.describe("[Sales Portal] [Add Products]", () => {
  test("Add new product and verify", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await signInPage.open();
    await expect(signInPage.emailInput).toBeVisible();

    await signInPage.fillCredentials(credentials.username, credentials.password);
    await signInPage.clickLogin();

    await signInPage.waitForLoaded();
    await expect(homePage.welcomeText).toBeVisible();

    await homePage.clickOnViewModule("Products");

    await productsPage.uniqueElement.waitFor({ state: "visible", timeout: 60000 });

    const product = generateProductData();
    await productsPage.addProduct(product);

    await expect(productsPage.toastMessage).toHaveText("Product was successfully created");

    await productsPage.verifyFirstRow(product.name, product.price.toString());
  });
});