import * as keys from "../src/session/keys";
import {loadSession} from "../src/services/redis.service";
import Session from "../src/session/session";
import {PTFCompanyProfile} from "../src/model/company.profile";

export const ACCESS_TOKEN = "KGGGUYUYJHHVK1234";

export const loadMockSession = (mockLoadSessionFunction: jest.Mock<typeof loadSession>): void => {
  mockLoadSessionFunction.prototype.constructor.mockImplementation(async (cookieId) => {
    const session = Session.newWithCookieId(cookieId);
    session.data = {
      [keys.SIGN_IN_INFO]: {
        [keys.SIGNED_IN]: 1,
        [keys.ACCESS_TOKEN]: {
          [keys.ACCESS_TOKEN]: ACCESS_TOKEN,
        },
        [keys.USER_PROFILE]: {
          [keys.USER_ID]: "123",
        },
      },
    };
    return session;
  });
};

export const COMPANY_NUMBER = "00006400";
export const COMPANY_NAME = "GIRLS TRUST";
export const COMPANY_STATUS_ACTIVE = "Active";
export const COMPANY_STATUS_LIQUIDATED = "liquidated";
export const COMPANY_TYPE = "Limited";
export const COMPANY_INC_DATE = "23 September 1973";
export const HAS_BEEN_LIQUIDATED = false;
export const HAS_CHARGES = true;
export const HAS_INSOLVENCY_HISTORY = true;
export const LINE_1 = "123";
export const LINE_2 = "street";
export const POST_CODE = "CF1 123";
export const ACCOUNTS_NEXT_DUE_DATE = "2019-05-12";
export const CONFIRMATION_STATEMENT_NEXT_DUE_DATE = "2019-09-03";
export const EMAIL = "demo@ch.gov.uk";

export const getDummyCompanyProfile = (isOverdue: boolean, isActive): PTFCompanyProfile => {
  return {
    accountingPeriodEndOn: ACCOUNTS_NEXT_DUE_DATE,
    accountingPeriodStartOn: ACCOUNTS_NEXT_DUE_DATE,
    accountsDue: ACCOUNTS_NEXT_DUE_DATE,
    address: {
      line_1: LINE_1,
      line_2: LINE_2,
      postCode: POST_CODE,
    },
    companyName: COMPANY_NAME,
    companyNumber: COMPANY_NUMBER,
    companyStatus: isActive ? COMPANY_STATUS_ACTIVE : COMPANY_STATUS_LIQUIDATED,
    companyType: COMPANY_TYPE,
    confirmationStatementDue: CONFIRMATION_STATEMENT_NEXT_DUE_DATE,
    incorporationDate: COMPANY_INC_DATE,
    isAccountsOverdue: isOverdue,
    isConfirmationStatementOverdue: isOverdue,
  };
};