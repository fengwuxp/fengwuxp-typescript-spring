import {BaseRequestMappingOptions, generateMapping, Mapping} from "./Mapping";
import {HttpMethod} from "../../constant/http/HttpMethod";

/**
 * PostMapping
 */
export const PostMapping: Mapping<BaseRequestMappingOptions> = generateMapping<BaseRequestMappingOptions>(HttpMethod.POST);
