import {BaseRequestMappingOptions, generateMapping, Mapping} from "./Mapping";
import {HttpMethod} from "../../constant/http/HttpMethod";


/**
 * GetMapping
 */
export const GetMapping: Mapping<BaseRequestMappingOptions> = generateMapping<BaseRequestMappingOptions>(HttpMethod.GET);
