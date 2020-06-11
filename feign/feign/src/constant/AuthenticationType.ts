/**
 *  Request API, type of authentication
 *  {@see AuthenticationClientHttpRequestInterceptor#interceptor}
 *  {@see BaseRequestMappingOptions#authenticationType}
 */
export enum AuthenticationType {

    NONE,

    // only try get authentication
    TRY,

    FORCE
}
