import "fengwuxp-typescript-feign/src/fetch.promise";
import {Feign} from "fengwuxp-typescript-feign/src/annotations/Feign";
import {RequestMapping} from "fengwuxp-typescript-feign/src/annotations/mapping/RequestMapping";
import {PostMapping} from "fengwuxp-typescript-feign/src/annotations/mapping/PostMapping";
import {DeleteMapping} from "fengwuxp-typescript-feign/src/annotations/mapping/DeleteMapping";
import {GetMapping} from "fengwuxp-typescript-feign/src/annotations/mapping/GetMapping";
import {PutMapping} from "fengwuxp-typescript-feign/src/annotations/mapping/PutMapping";
import {Signature} from "fengwuxp-typescript-feign/src/annotations/security/Signature";
import {HttpMethod} from "fengwuxp-typescript-feign/src/constant/HttpMethod";
import {HttpMediaType} from "fengwuxp-typescript-feign/src/constant/http/HttpMediaType";
import FeignConfigurationRegistry from 'fengwuxp-typescript-feign/src/configuration/FeignConfigurationRegistry';



export {
    Feign,
    RequestMapping,
    PostMapping,
    DeleteMapping,
    GetMapping,
    PutMapping,
    Signature,
    HttpMethod,
    HttpMediaType,

    FeignConfigurationRegistry
}
