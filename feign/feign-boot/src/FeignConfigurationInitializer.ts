// import {FeignConfigurationAdapter} from "./configuration/FeignConfigurationAdapter";
// import {AbstractFeignConfiguration} from "./configuration/AbstractFeignConfiguration";
// import {FeignConfiguration, FeignConfigurationRegistry} from "fengwuxp-typescript-feign";
//
// const invokeFunction = <T extends Function>(func: T): T => {
//     if (typeof func !== "function") {
//         return function () {
//         } as any;
//     }
//     return func
// };
//
// const feignConfigurationInitializer: FeignConfigurationInitializer = {
//
//     init: function (feignConfigurationAdapter: FeignConfigurationAdapter,) {
//
//         const defaultFeignConfiguration: FeignConfigurationAdapter = null;
//
//         FeignConfigurationRegistry.setDefaultFeignConfiguration({
//             getApiSignatureStrategy: invokeFunction(defaultFeignConfiguration.getApiSignatureStrategy),
//             getFeignClientBuilder: invokeFunction(defaultFeignConfiguration.getFeignClientBuilder),
//             getFeignClientExecutor: invokeFunction(defaultFeignConfiguration.getFeignClientExecutor),
//             getFeignClientExecutorInterceptors: invokeFunction(defaultFeignConfiguration.getFeignClientExecutorInterceptors),
//             getHttpAdapter: () => {
//                 return invokeFunction(feignConfigurationAdapter.httpAdapter)(defaultFeignConfiguration.getHttpAdapter());
//             },
//             getHttpClient: () => {
//                 const httpClient = invokeFunction(defaultFeignConfiguration.getHttpClient)();
//                 httpClient.setInterceptors(
//                     feignConfigurationAdapter.registryClientHttpRequestInterceptors(httpClient.getInterceptors() || [])
//                 );
//                 return httpClient;
//             },
//             getRequestHeaderResolver: invokeFunction(defaultFeignConfiguration.getRequestHeaderResolver),
//             getRequestURLResolver: invokeFunction(defaultFeignConfiguration.getRequestURLResolver),
//             getRestTemplate: invokeFunction(defaultFeignConfiguration.getRestTemplate)
//
//         })
//     }
//
// };
//
//
