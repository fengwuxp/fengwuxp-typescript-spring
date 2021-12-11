import {UriTemplateHandlerFunction, UriTemplateHandlerInterface} from "./UriTemplateHandler";
import {UriVariable} from "./RestOperations";
import {queryStringify} from "../utils/SerializeRequestBodyUtil";
import {replacePathVariableValue} from "../helper/ReplaceUriVariableHelper";

/**
 * @see UriTemplateHandlerFunction
 * @param uriTemplate url
 * @param uriVariables url params
 */
export const defaultUriTemplateFunctionHandler: UriTemplateHandlerFunction = (uriTemplate: string, uriVariables: UriVariable) => {

    if (uriVariables == null) {
        return uriTemplate;
    }
    // replace uri path variable
    uriTemplate = replacePathVariableValue(uriTemplate, uriVariables);
    if (Object.keys(uriVariables).length === 0) {
        //if uriVariables is empty return,else handle queryString
        return uriTemplate;
    }
    const [uri, queryString] = uriTemplate.split("?");
    const hasQueryString = queryString != null;
    const newUri = `${uri}?${queryStringify(uriVariables as any)}`;

    if (hasQueryString) {
        return hasQueryString ? `${newUri}&${queryString}` : newUri;
    }
    return newUri;

};

export class DefaultUriTemplateHandler implements UriTemplateHandlerInterface {
    expand = defaultUriTemplateFunctionHandler;
}
