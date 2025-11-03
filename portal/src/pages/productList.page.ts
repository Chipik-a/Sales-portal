// import { IProductInTable } from "../data/types/product.types";
// import { SalesPortalPage } from "../pages/salesPortal.page";
// import { MANUFACTURERS } from "../data/salesPortal/products/manufacturers";
// //import { ProductDetailsModal } from "./details.modal";

// export class ProductsListPage extends SalesPortalPage {
//   readonly detailsModal = new ProductDetailsModal(this.page);

//   readonly productsPageTitle = this.page.locator("h2.fw-bold");
//   readonly addNewProductButton = this.page.locator('[name="add-button"]');
//   readonly tableRow = this.page.locator("tbody tr");
//   readonly tableRowByName = (productName: string) =>
//     this.page.locator("table tbody tr", { has: this.page.locator("td", { hasText: productName }) });
//   readonly tableRowByIndex = (index: number) => this.page.locator("table tbody tr").nth(index);
//   readonly nameCell = (productName: string) => this.tableRowByName(productName).locator("td").nth(0);
//   readonly priceCell = (productName: string) => this.tableRowByName(productName).locator("td").nth(1);
//   readonly manufacturerCell = (productName: string) => this.tableRowByName(productName).locator("td").nth(2);
//   // readonly createdOnCell = (productName: string) => this.tableRowByName(productName).locator("td").nth(3);
//   readonly createdOnCell = (nameOrIndex: string | number) =>
//     typeof nameOrIndex === "string"
//       ? this.tableRowByName(nameOrIndex).locator("td").nth(3)
//       : this.tableRowByIndex(nameOrIndex).locator("td").nth(3);

//   readonly editButton = (productName: string) => this.tableRowByName(productName).getByTitle("Edit");
//   readonly detailsButton = (productName: string) => this.tableRowByName(productName).getByTitle("Details");
//   readonly deleteButton = (productName: string) => this.tableRowByName(productName).getByTitle("Delete");

//   readonly uniqueElement = this.addNewProductButton;

//   async clickAddNewProduct() {
//     await this.addNewProductButton.click();
//   }

//   async getProductData(productName: string): Promise<IProductInTable> {
//     //Variant 1
//     // return {
//     //   name: await this.nameCell(productName).innerText(),
//     //   price: +(await this.priceCell(productName).innerText()).replace("$", ""),
//     //   manufacturer: (await this.manufacturerCell(productName).innerText()) as MANUFACTURERS,
//     //   createdOn: await this.createdOnCell(productName).innerText(),
//     // };

//     //variant 2
//     // const [name, price, manufacturer, createdOn] = await Promise.all([
//     //   this.nameCell(productName).textContent(),
//     //   this.priceCell(productName).textContent(),
//     //   this.manufacturerCell(productName).textContent(),
//     //   this.createdOnCell(productName).textContent(),
//     // ]);
//     // return {
//     //   name: name!,
//     //   price: +price!.replace("$", ""),
//     //   manufacturer: manufacturer! as MANUFACTURERS,
//     //   createdOn: createdOn!,
//     // };

//     //variant 3
//     const [name, price, manufacturer, createdOn] = await this.tableRowByName(productName).locator("td").allInnerTexts();
//     return {
//       name: name!,
//       price: +price!.replace("$", ""),
//       manufacturer: manufacturer! as MANUFACTURERS,
//       createdOn: createdOn!,
//     };
//   }

//   async getTableData(): Promise<IProductInTable[]> {
//     const data: IProductInTable[] = [];

//     const rows = await this.tableRow.all();
//     for (const row of rows) {
//       const [name, price, manufacturer, createdOn] = await row.locator("td").allInnerTexts();
//       data.push({
//         name: name!,
//         price: +price!.replace("$", ""),
//         manufacturer: manufacturer! as MANUFACTURERS,
//         createdOn: createdOn!,
//       });
//     }
//     return data;
//   }
// }