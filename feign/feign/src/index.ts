import {FeignOptions} from "./annotations/Feign";

export {HttpAdapter} from "./adapter/HttpAdapter";

export {RequestMapping} from "./annotations/mapping/RequestMapping";
export {GetMapping} from "./annotations/mapping/GetMapping";
export {PostMapping} from "./annotations/mapping/PostMapping";
export {PatchMapping} from "./annotations/mapping/PatchMapping";
export {PutMapping} from "./annotations/mapping/PutMapping";
export {DeleteMapping} from "./annotations/mapping/DeleteMapping";
export {DataObfuscation} from "./annotations/security/DataObfuscation";
export {Signature} from "./annotations/security/Signature";
export {FileUpload, AutoFileUploadOptions} from "./annotations/upload/FileUpload";
export {FeignRetry} from "./annotations/retry/FeignRetry";
export {Feign, FeignOptions} from "./annotations/Feign";

export {AbstractHttpClient} from "./client/AbstractHttpClient";
export {
    ClientHttpRequestInterceptorInterface, ClientHttpRequestInterceptorFunction, ClientHttpRequestInterceptor
} from "./client/ClientHttpRequestInterceptor";
export {default as DefaultHttpClient} from "./client/DefaultHttpClient";
export {HttpClient, HttpRequestBody} from "./client/HttpClient";
export {HttpRequest} from "./client/HttpRequest";
export {HttpResponse} from "./client/HttpResponse";
export {HttpRetryOptions} from "./client/HttpRetryOptions";
export {default as RetryHttpClient} from "./client/RetryHttpClient";
export {default as RoutingClientHttpRequestInterceptor} from "./client/RoutingClientHttpRequestInterceptor";
export {
    default as AuthenticationClientHttpRequestInterceptor
} from "./client/AuthenticationClientHttpRequestInterceptor";
export {
    AuthenticationToken,
    AuthenticationStrategy,
    CacheCapableAuthenticationStrategy,
    NEVER_REFRESH_FLAG
} from "./client/AuthenticationStrategy";

export {default as NetworkClientHttpRequestInterceptor} from "./network/NetworkClientHttpRequestInterceptor";
export {default as DefaultNetworkStatusListener} from "./network/DefaultNoneNetworkFailBack";
export {NetworkStatusListener, NetworkStatus, NetworkType} from "./network/NetworkStatusListener";
export {NoneNetworkFailBack} from "./network/NoneNetworkFailBack";
export {default as SimpleNetworkStatusListener} from "./network/SimpleNoneNetworkFailBack";
export {default as NetworkFeignClientExecutorInterceptor} from "./network/NetworkFeignClientExecutorInterceptor";

export {default as CodecFeignClientExecutorInterceptor} from "./codec/CodecFeignClientExecutorInterceptor";
export {default as DateEncoder} from "./codec/DateEncoder";
export {DateConverter, stringDateConverter, timeStampDateConverter} from "./codec/converter/DateConverter";
export {HttpRequestDataEncoder} from "./codec/HttpRequestDataEncoder";
export {HttpResponseDataDecoder} from "./codec/HttpResponseDataDecoder";

export {FeignConfiguration} from "./configuration/FeignConfiguration";
export {default as FeignConfigurationRegistry} from "./configuration/FeignConfigurationRegistry";

export {HttpMethod} from "./constant/http/HttpMethod";
export {HttpStatus} from "./constant/http/HttpStatus";
export {HttpMediaType} from "./constant/http/HttpMediaType";
export {
    defaultApiModuleName,
    contentTypeName,
    contentLengthName,
    contentTransferEncodingName,
    matchUrlPathVariable,
    FEIGN_CLINE_META_KEY,
    grabUrlPathVariable
} from "./constant/FeignConstVar";

export {MappedInterceptor} from "./interceptor/MappedInterceptor";
export {default as MappedFeignClientExecutorInterceptor} from "./interceptor/MappedFeignClientExecutorInterceptor";
export {default as MappedClientHttpRequestInterceptor} from "./interceptor/MappedClientHttpRequestInterceptor";

export {ResolveHttpResponse} from "./resolve/ResolveHttpResponse";
export {default as CommonResolveHttpResponse} from "./resolve/CommonResolveHttpResponse";
export {RequestHeaderResolver} from "./resolve/header/RequestHeaderResolver";
export {simpleRequestHeaderResolver} from "./resolve/header/SimpleRequestHeaderResolver";
export {RequestURLResolver} from "./resolve/url/RequestURLResolver";
export {restfulRequestURLResolver} from "./resolve/url/RestFulRequestURLResolver";
export {simpleRequestURLResolver} from "./resolve/url/SimpleRequestURLResolver";

export {ApiSignatureStrategy, SimpleApiSignatureStrategy} from "./signature/ApiSignatureStrategy";

export {FeignClientMethodConfig} from "./support/FeignClientMethodConfig";
export {FeignProxyClient} from "./support/FeignProxyClient";
export {GenerateAnnotationMethodConfig} from "./support/GenerateAnnotationMethodConfig";
export {defaultGenerateAnnotationMethodConfig} from "./support/DefaultGenerateAnnotationMethodConfig";

export {
    objectResponseExtractor, voidResponseExtractor, headResponseExtractor, optionsMethodResponseExtractor
} from "./template/RestResponseExtractor";
export {DefaultUriTemplateHandler, defaultUriTemplateFunctionHandler} from "./template/DefaultUriTemplateHandler";
export {
    ResponseErrorHandlerFunction, ResponseErrorHandlerInterFace, ResponseErrorHandler
} from "./template/ResponseErrorHandler";
export {ResponseExtractor, ResponseExtractorInterface, ResponseExtractorFunction} from "./template/ResponseExtractor";
export {RestOperations, UriVariable, QueryParamType} from "./template/RestOperations";
export {default as RestTemplate} from "./template/RestTemplate";

export {
    UriTemplateHandler, UriTemplateHandlerInterface, UriTemplateHandlerFunction
} from "./template/UriTemplateHandler";

export {default as ProcessBarExecutorInterceptor} from "./ui/ProcessBarExecutorInterceptor";
export {default as UnifiedFailureToastExecutorInterceptor} from "./ui/UnifiedFailureToastExecutorInterceptor";
export {RequestProgressBar} from "./ui/RequestProgressBar";
export {FileUploadProgressBar} from "./ui/FileUploadProgressBar";
export {
    default as FeignUIToastHolder, FeignUIToastInterface, FeignUIToastFunction, FeignUIToast, UnifiedFailureToast
} from "./ui/FeignUIToast";

export {AbstractRequestFileObjectEncoder} from "./upload/AbstractRequestFileObjectEncoder"
export {
    FileUploadStrategy, FileUploadStrategyResult, FileUploadStrategyResultInterface
} from "./upload/FileUploadStrategy"
export {AbstractFileUploadStrategy} from "./upload/AbstractFileUploadStrategy"

export {mediaTypeIsEq, responseIsJson, responseIsFile, responseIsText} from "./utils/MediaTypeUtil";
export {
    supportRequestBody, serializeRequestBody, filterNoneValueAndNewObject, queryStringify
} from "./utils/SerializeRequestBodyUtil";
export {invokeFunctionInterface} from "./utils/InvokeFunctionInterface";

export {
    ValidatorDescriptor, ClientRequestDataValidator, ValidateInvokeOptions
} from "./validator/ClientRequestDataValidator"
export {default as AsyncClientRequestDataValidator} from "./validator/AsyncClientRequestDataValidator"
export {default as ClientRequestDataValidatorHolder} from "./validator/ClientRequestDataValidatorHolder"

export {DefaultFeignClientBuilder, defaultFeignClientBuilder} from "./DefaultFeignClientBuilder";
export {default as DefaultFeignClientExecutor} from "./DefaultFeignClientExecutor";
export {FeignClient} from "./FeignClient";
export {FeignClientBuilderFunction, FeignClientBuilderInterface, FeignClientBuilder} from "./FeignClientBuilder";
export {FeignClientExecutor} from "./FeignClientExecutor";
export {FeignClientExecutorInterceptor} from "./FeignClientExecutorInterceptor";
export {
    FeignRequestId,
    FeignRequestBaseOptions,
    FeignRequestOptions,
    UIOptions,
    FeignRequestContextOptions,
    ProgressBarOptions,
    FileUploadProgressBarOptions
} from "./FeignRequestOptions";
export {Enum} from "./EnumInterface";
