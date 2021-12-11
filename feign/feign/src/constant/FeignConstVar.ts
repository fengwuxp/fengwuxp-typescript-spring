import {HttpStatus} from "./http/HttpStatus";

/**
 * default api module name
 */
export const defaultApiModuleName = "default";

export const LB_SCHEMA = "lb://"

export const HTTP_SCHEMA = "http://"

/**
 * http header content type name
 */
export const contentTypeName = 'Content-Type';

/**
 * http header content length name
 */
export const contentLengthName = "Content-Length";

/**
 * http header content transfer encoding name
 */
export const contentTransferEncodingName = 'Content-Transfer-Encoding';

/**
 * feign client metadata key
 */
export const FEIGN_CLINE_META_KEY = "FEIGN";


/**
 * grab shaped like example '1{abc}2ll3{efg}' string  ==> abc, efg
 */
export const grabUrlPathVariable = /\{(.+?)\}/g;


/**
 * mock unauthorized response
 */
export const UNAUTHORIZED_RESPONSE = {
    ok: false,
    statusCode: HttpStatus.UNAUTHORIZED,
    statusText: null,
};

/**
 * 用于获取接口权限类型的请求头
 */
export const REQUEST_AUTHENTICATION_TYPE_HEADER_NAME = 'X-Api-Authentication-Type'