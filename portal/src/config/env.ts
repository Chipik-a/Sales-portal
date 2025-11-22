import { ICredentials } from "../../src/data/types/credentials.types"

//export const HOME_PAGE_URL = "http://localhost:8585/#/home";
export const SALES_PORTAL_URL = "http://localhost:8585/";
export const SALES_PORTAL_API_URL = process.env.SALES_PORTAL_API_URL!;
export const credentials: ICredentials = {
  username: process.env.USER_EMAIL!,
  password: process.env.USER_PASSWORD!,
};

//add