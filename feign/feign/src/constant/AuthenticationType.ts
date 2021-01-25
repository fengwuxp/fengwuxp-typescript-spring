/**
 *  Request API, type of authentication
 *  {@see AuthenticationClientHttpRequestInterceptor#interceptor}
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