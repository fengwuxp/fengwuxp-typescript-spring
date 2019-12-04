import { UriVariable } from "./RestOperations";
/**
 * Defines methods for expanding a URI template with variables.
 */
export interface UriTemplateHandlerInterface {
    expand: UriTemplateHandlerFunction;
}
/**
 * Expand the given URI template with a map of URI variables.
 * @param uriTemplate the URI template
 * @param uriVariables variable values
 * @return the created URI instance
 */
export declare type UriTemplateHandlerFunction = (uriTemplate: string, uriVariables: UriVariable) => string;
export declare type UriTemplateHandler = UriTemplateHandlerInterface | UriTemplateHandlerFunction;
