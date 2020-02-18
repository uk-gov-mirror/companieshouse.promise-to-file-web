const callCurrentMockRequest: jest.Mock = jest.fn(() => dummyAxiosResponse);
jest.mock("axios", () => {
  return {
    default: {
      request: callCurrentMockRequest,
    },
  };
});

import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getBaseAxiosRequestConfig, makeAPICall } from "../../src/client/axios.api.call.handler";

const dummyAxiosResponse: AxiosResponse<any> = {
  config: {},
  data: {},
  headers: "header",
  status: 100,
  statusText: "Error",
};

describe("axios call handler", () => {
  beforeEach(() => {
    callCurrentMockRequest.mockClear();
  });

  it("should return config with the token argument value in header", async () => {
    const token: string = "abc123";
    const config: AxiosRequestConfig = getBaseAxiosRequestConfig(token);
    expect(config.headers).toEqual({ Accept: "application/json", Authorization: "Bearer abc123" });
  });

  it("should handle successful axios call", async () => {
    const config: AxiosRequestConfig = {};
    dummyAxiosResponse.status = 200;
    const response: AxiosResponse = await makeAPICall(config);
    expect(response.status).toEqual(200);
  });

  it("should handle axios errors", async () => {
    const config: AxiosRequestConfig = {};

    const errorMessage = "There is an error";
    const dataError = "Test error";
    const statusCode = 500;

    const axiosError = {
      message: errorMessage,
      response: {
        data: {
          errors: [dataError],
        },
        status: statusCode,
      },
    } as AxiosError;

    callCurrentMockRequest.mockRejectedValueOnce(axiosError);

    const expectedError = {
      data: [dataError],
      message: errorMessage,
      status: statusCode,
    };

    await expect(makeAPICall(config)).rejects.toMatchObject(expectedError);
  });
});
