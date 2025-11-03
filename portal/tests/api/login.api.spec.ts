import { test, expect } from "@playwright/test"
import { apiConfig } from "../../src/config/apiConfig";
import Ajv from "ajv";
import { loginResponseSchema } from "../../src/data/schemas/products/login.schema";
import dotenv from "dotenv";

dotenv.config();

const ajv = new Ajv();

test("[Sales Portal] [API] [Smoke test - login]", async ({ request }) => {
    const url = `${apiConfig.baseURL}${apiConfig.endpoints.login}`;
    const response = await request.post(url, {
    headers: {
        "Content-Type": "application/json",
      },
    data: {
        username: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
    },
  });
  expect(response.status()).toBe(200);

  const body = await response.json();
  const validate = ajv.compile(loginResponseSchema);
  const valid = validate(body);
  expect(valid, JSON.stringify(validate.errors)).toBeTruthy();

  expect(body.IsSuccess).toBe(true);
  expect(body.ErrorMessage).toBeNull();

    const headers = response.headers();
  const token = headers["authorization"] || headers["Authorization"];
  expect(token, "Token must exist in headers").toBeTruthy();
});