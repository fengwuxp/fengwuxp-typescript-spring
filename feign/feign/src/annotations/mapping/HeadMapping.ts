import {BaseRequestMappingOptions, generateMapping, Mapping} from "./Mapping";
import {HttpMethod} from "../../constant/http/HttpMethod";


/**
 * HeadMapping
 */
export const HeadMapping: Mapping = generateMapping<BaseRequestMappingOptions>(HttpMethod.HEAD);