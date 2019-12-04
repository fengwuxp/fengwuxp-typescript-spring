/**
 * is browser
 */
export const isBrowser = () => typeof window !== "undefined";


/**
 * is browser form data
 * @param data
 */
export const isBrowserFormData = (data) => isBrowser() && data instanceof FormData;
