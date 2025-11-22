import test, { expect } from "@playwright/test";
import { apiConfig } from "../../../src/config/apiConfig";
import { credentials } from "../../../src/config/env";
import { generateProductData } from "../../../src/data/salesPortal/products/generateProductData"
import { createProductSchema } from "../../../src/data/schemas/products/create.schema";
import { getProductSchema } from "../../../src/data/schemas/products/get.schema";
import { STATUS_CODES } from "../../../src/data/statusCodes" 
import _ from "lodash";
import { validateResponse } from "../../../src/utils/validateResponse.utils"
const { baseURL, endpoints } = apiConfig;

test.describe("[API] [Sales Portal] [Products]", () => {
  let id = "";
  let token = "";

  test.afterEach(async ({ request }) => {
    const response = await request.delete(`${baseURL}${endpoints.productById(id)}`, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    expect(response.status()).toBe(STATUS_CODES.DELETED);
  });

  test("Get Product By Id", async ({ request }) => {
    //TODO: Preconditions
    const loginResponse = await request.post(baseURL + endpoints.login, {
      data: credentials,
      headers: {
        "content-type": "application/json",
      },
    });
    const loginBody = await loginResponse.json();
    expect.soft(loginResponse.status()).toBe(STATUS_CODES.OK);
    expect.soft(loginBody.IsSuccess).toBe(true);
    expect.soft(loginBody.ErrorMessage).toBe(null);
    expect.soft(loginBody.User.username).toBe(credentials.username);

    const headers = loginResponse.headers();
    token = headers["authorization"]!;
    expect(token).toBeTruthy();

    const productData = generateProductData();
    const createProductResponse = await request.post(baseURL + endpoints.products, {
      data: productData,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const createProductBody = await createProductResponse.json();
    await validateResponse(createProductResponse, {
      status: STATUS_CODES.CREATED,
      schema: createProductSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });

    const actualProductData = createProductBody.Product;

    expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(productData);

    id = actualProductData._id;

    //TODO: Action

    const getProductResponse = await request.get(`${baseURL}${endpoints.productById(actualProductData._id)}`, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const getProductBody = await getProductResponse.json();
    await validateResponse(getProductResponse, {
      status: STATUS_CODES.OK,
      schema: getProductSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });
    expect(_.omit(getProductBody.Product, ["_id", "createdOn"])).toEqual(productData);
  });
});