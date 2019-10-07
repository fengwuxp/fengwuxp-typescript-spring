/**
 * 是否为浏览器
 */
export const isBrowser = () => typeof window !== "undefined";


/**
 * 是否为 browser form data
 * @param data
 */
export const isBrowserFormData = (data) => isBrowser() && data instanceof FormData;