import {BaseRequestMappingOptions, generateMapping, Mapping} from "./Mapping";
import {HttpMethod} from "../../constant/http/HttpMethod";


/**
 * PutMapping
 */
export const PutMapping: Mapping<BaseRequestMappingOptions> = generateMapping<BaseRequestMappingOptions>(HttpMethod.PUT);
