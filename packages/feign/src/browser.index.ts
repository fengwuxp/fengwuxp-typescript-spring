import {RequestMapping} from "./annotations/mapping/RequestMapping";
import {PostMapping} from "./annotations/mapping/PostMapping";
import {PatchMapping} from "./annotations/mapping/PatchMapping";
import {PutMapping} from "./annotations/mapping/PutMapping";
import {DeleteMapping} from "./annotations/mapping/DeleteMapping";
import {DataObfuscation} from "./annotations/security/DataObfuscation";
import {Signature} from "./annotations/security/Signature";
import {FileUpload} from "./annotations/upload/FileUpload";
import {FeignRetry} from "./annotations/retry/FeignRetry";
import {Feign} from "./annotations/Feign";
import DefaultHttpClient from "./client/DefaultHttpClient";
import NetworkClientHttpRequestInterceptor from "./client/NetworkClientHttpRequestInterceptor";
import RetryHttpClient from "./client/RetryHttpClient";
import {NetworkType} from "./client/NetworkStatusListener";



export default {
    RequestMapping,
    PostMapping,
    PatchMapping,
    PutMapping,
    DeleteMapping,
    DataObfuscation,
    Signature,
    FileUpload,
    FeignRetry,
    Feign,

    DefaultHttpClient,
    RetryHttpClient,
    NetworkClientHttpRequestInterceptor,
    NetworkType

}
