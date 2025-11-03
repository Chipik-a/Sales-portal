import test, { expect } from "@playwright/test";
import { apiConfig } from "../../../src/config/apiConfig";
import { credentials } from "../../../src/config/env";
import { generateProductData } from "../../../src/data/salesPortal/products/generateProductData";
import { createProductSchema } from "../../../src/data/schemas/products/create.schema";
import { STATUS_CODES } from "../../../src/data/statusCodes";
import { validateResponse } from "../../../src/utils/validateResponse.utils";
import { productSchema } from "../../../src/data/schemas/products/product.schema";
import Ajv from "ajv";

const { baseURL, endpoints } = apiConfig;
const ajv = new Ajv();

test.describe("[API] [Sales Portal] [Products]", () => {
  let id = "";
  let token = "";

  test.afterEach(async ({ request }) => {
    if (id && token) {
      const response = await request.delete(`${baseURL}${endpoints.productById(id)}`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      expect.soft(response.status()).toBe(STATUS_CODES.DELETED);
    }
  });

  test("Get All Products (Smoke)", async ({ request }) => {
    const loginResponse = await request.post(baseURL + endpoints.login, {
      data: credentials,
      headers: { "content-type": "application/json" },
    });
    const loginBody = await loginResponse.json();

    expect.soft(loginResponse.status()).toBe(STATUS_CODES.OK);
    expect.soft(loginBody.IsSuccess).toBe(true);
    expect.soft(loginBody.ErrorMessage).toBe(null);

    const headers = loginResponse.headers();
    token = headers["authorization"]!;
    expect(token, "Authorization token should exist").toBeTruthy();

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

    id = createProductBody.Product._id;
    expect(id, "Product ID should exist after creation").toBeTruthy();

    const getAllResponse = await request.get(baseURL + endpoints.productsAll, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await getAllResponse.json();

    const validate = ajv.compile({
      type: "object",
      required: ["IsSuccess", "ErrorMessage", "Products"],
      properties: {
        IsSuccess: { type: "boolean" },
        ErrorMessage: { type: ["string", "null"] },
        Products: {
          type: "array",
          items: { $ref: "#/definitions/product" },
        },
      },
      definitions: {
        product: productSchema,
      },
      additionalProperties: false,
    });

    const valid = validate(body);
    expect(valid, JSON.stringify(validate.errors)).toBeTruthy();

    expect(getAllResponse.status()).toBe(STATUS_CODES.OK);

    const found = body.Products.some((p: any) => p._id === id);
    expect(found, "Created product should exist in the product list").toBe(true);

    expect(body.IsSuccess).toBe(true);
    expect(body.ErrorMessage).toBeNull();
  });
});
