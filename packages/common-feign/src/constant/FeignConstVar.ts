/**
 * default api module name
 */
export const defaultApiModuleName = "default";

/**
 * http header content type name
 */
export const contentTypeName = 'Content-Type';


/**
 * match shaped like example '1{xxx}2ll3' string
 */
export const matchUrlPathVariable = /\{\w*\}/;

/**
 * grab shaped like example '1{abc}2ll3{efg}' string  ==> abc, efg
 */
export const grabUrlPathVariable = /\{(.+?)\}/g;
