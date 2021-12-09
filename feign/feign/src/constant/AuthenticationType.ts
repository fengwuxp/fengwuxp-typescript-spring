/**
 *  Request API, type of authentication
 *  {@see AuthenticationClientHttpRequestInterceptor#intercept}
 *  {@see BaseRequestMappingOptions#authenticationType}
 */
export enum AuthenticationType {

    NONE,

    // only try get authentication
    TRY,

    FORCE,

    // default，由使用者自行处理
    DEFAULT
}