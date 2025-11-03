/*Создайте e2e тест со следующими шагами:
1. Зайти на сайт Sales Portal
2. Залогиниться с вашими кредами
3. Перейти на страницу Products List
4. Перейти на станицу Add New Product
5. Создать продукта
6. Проверить наличие продукта в таблице
7. Кликнуть на кнопку "Delete" в таблице для созданного продукта
8. В модалке удаления кликнуть кнопку Yes, Delete
9. Дождаться исчезновения модалки и загрузки страницы
10. Проверить, что продукт отсутствует в таблице

Вам понадобится:

- PageObject модалки удаления продукта
- Подключить модалку в PageObject страницы Products
- Использовать фикстуры */
import { expect } from "@playwright/test";
import { test } from "../../src/fixtures/login.fixture";
import { ProductsPage } from "../../src/pages/productPage.page";
import { generateProductData } from "../../src/data/salesPortal/products/generateProductData";
import { NOTIFICATIONS } from "../../src/data/salesPortal/notifications";

test("[Sales Portal] [add and delete product]", async ({ loginPage, page }) => {
    const product = generateProductData();
    const productsPage = new ProductsPage(page);
   // await productsPage.navigateToAddNewProduct();

    await productsPage.addProduct(product);
    await expect(productsPage.toastMessage).toHaveText(NOTIFICATIONS.PRODUCT_CREATED);
    await productsPage.verifyFirstRow(product.name, String(product.price));

    await productsPage.deleteProduct(product.name);

    await productsPage.verifyProductNotInTable(product.name);
});
