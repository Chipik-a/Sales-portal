import { test as base, Page } from "@playwright/test";
import dotenv from "dotenv";
import { SignInPage } from "../pages/signInPage.page";
import { HomePage } from "../pages/homePage.page";

dotenv.config();

type MyFixteres = {
    loginPage: HomePage;
}

export const test = base.extend<MyFixteres>({ 
    loginPage: async ({ page }, use) => {
        const signIn = new SignInPage(page);
        await signIn.open();
        await signIn.fillCredentials(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
        await signIn.clickLogin();
        await signIn.waitForLoaded();

        const homePage = new HomePage(page);
        await homePage.clickOnViewModule("Products");
        await use(homePage);
    }
});
