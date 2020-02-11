import * as request from "supertest";
import app from "../../src/app";
import * as pageURLs from "../../src/model/page.urls";
import {COOKIE_NAME} from "../../src/properties";
import {loadSession} from "../../src/services/redis.service";
import {getPromiseToFileSessionValue, updatePromiseToFileSessionValue} from "../../src/services/session.service";
import {getDummyCompanyProfile, loadCompanyAuthenticatedSession, loadMockSession} from "../mock.utils";

jest.mock("../../src/session/store/redis.store", () => import("../mocks/redis.store.mock.factory"));
jest.mock("../../src/services/redis.service");
jest.mock("../../src/client/apiclient");
jest.mock("../../src/services/session.service");

const COMPANY_NUMBER: string = "00006400";
const COMPANY_NAME: string = "THE GIRLS DAY SCHOOL TRUST";
const EMAIL: string = "test@demo.ch.gov.uk";
const PAGE_TITLE: string = "Confirmation page";
const URL: string = pageURLs.PROMISE_TO_FILE + "/company/" + COMPANY_NUMBER + "/confirmation";
const ERROR_PAGE: string = "Sorry, there is a problem with the service";

describe("confirmation screen stating that the company is no longer required", () => {

  const mockCacheService = loadSession as jest.Mock;
  const mockPTFSession =  getPromiseToFileSessionValue as jest.Mock;
  const mockUpdatePromiseToFileSessionValue = updatePromiseToFileSessionValue as jest.Mock;

  it("should render the confirmation no longer required page", async () => {
    mockCacheService.mockClear();
    mockPTFSession.mockClear();
    loadCompanyAuthenticatedSession(mockCacheService, COMPANY_NUMBER, EMAIL);
    mockPTFSession.mockResolvedValue(getDummyCompanyProfile(true, true));
    const resp = await request(app)
        .get(URL)
        .set("Cookie", [`${COOKIE_NAME}=123`]);

    expect(resp.status).toEqual(200);
    expect(resp.text).toContain(COMPANY_NAME);
    expect(resp.text).not.toContain(COMPANY_NUMBER);
    expect(resp.text).toContain(EMAIL);
    expect(resp.text).toContain(PAGE_TITLE);
  });

  it("should return the error page if email is missing from session", async () => {
    mockCacheService.mockClear();
    mockPTFSession.mockClear();
    loadCompanyAuthenticatedSession(mockCacheService, COMPANY_NUMBER, null);
    const resp = await request(app)
        .get(URL)
        .set("Referer", "/")
        .set("Cookie", [`${COOKIE_NAME}=123`]);

    expect(resp.status).toEqual(500);
    expect(resp.text).not.toContain(EMAIL);
    expect(resp.text).not.toContain(COMPANY_NAME);
    expect(resp.text).not.toContain(COMPANY_NUMBER);
    expect(resp.text).not.toContain(PAGE_TITLE);
    expect(resp.text).toContain(ERROR_PAGE);
  });

  it("should return the error page if company profile is missing from session", async () => {
    mockCacheService.mockClear();
    mockPTFSession.mockClear();
    loadCompanyAuthenticatedSession(mockCacheService, COMPANY_NUMBER, EMAIL);
    mockPTFSession.mockResolvedValue(null);
    const resp = await request(app)
        .get(URL)
        .set("Referer", "/")
        .set("Cookie", [`${COOKIE_NAME}=123`]);

    expect(resp.status).toEqual(500);
    expect(resp.text).not.toContain(EMAIL);
    expect(resp.text).not.toContain(COMPANY_NAME);
    expect(resp.text).not.toContain(COMPANY_NUMBER);
    expect(resp.text).not.toContain(PAGE_TITLE);
    expect(resp.text).toContain(ERROR_PAGE);
  });
});
