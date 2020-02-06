import * as template from "./template.paths";

/**
 * Keep template names in template.paths.ts and reference them in here for URLs
 */

export const ROOT: string = "/";
const SEPARATOR: string = "/";
export const PROMISE_TO_FILE: string = SEPARATOR + "promise-to-file";
export const COMPANY_NUMBER: string = SEPARATOR + template.COMPANY_NUMBER;
export const CHECK_COMPANY: string = SEPARATOR + template.CHECK_COMPANY;
export const COMPANY_AUTH_PROTECTED_ROUTE = SEPARATOR + "company/:companyNumber/";

/**
 * URLs for redirects will need to start with the application name
 */
export const PROMISE_TO_FILE_COMPANY_NUMBER: string = PROMISE_TO_FILE + COMPANY_NUMBER;
export const PROMISE_TO_FILE_CHECK_COMPANY: string = PROMISE_TO_FILE + CHECK_COMPANY;

export const CONTINUE_TRADING = COMPANY_AUTH_PROTECTED_ROUTE + "continue-trading";
