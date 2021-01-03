import {UriVariable} from "./RestOperations";


/**
 * Defines methods for expanding a URI template with variables.
 * <code>
 *     example
 *     UriTemplateHandler(' http://a.b.com/{module}/{id}?name=李四',{module:'test',id:2})
 *     ==>
 *       http://a.b.com/test/2?name=李四
 * </code>
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
export type UriTemplateHandlerFunction = (uriTemplate: string, uriVariables: UriVariable) => string

export type UriTemplateHandler = UriTemplateHandlerInterface | UriTemplateHandlerFunction;
