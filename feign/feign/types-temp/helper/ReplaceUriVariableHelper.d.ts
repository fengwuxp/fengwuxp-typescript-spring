/**
 * replace url path variable
 * @param uriVariables
 * @param uriVariablesIsArray
 */
import { UriVariable } from "../template/RestOperations";
/**
 * replace the value of bdc in the form ‘a_{bdc}’
 * @param uriTemplate
 * @param uriVariables
 */
export declare const replacePathVariableValue: (uriTemplate: string, uriVariables: UriVariable) => string;
