import {UriTemplateHandlerFunction, UriTemplateHandlerInterface} from "./UriTemplateHandler";
import {UriVariable} from "./RestOperations";
import {queryStringify} from "../utils/SerializeRequestBodyUtil";
import {replacePathVariableValue} from "../helper/ReplaceUriVariableHelper";


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
    const newUrl = `${uri}?${queryStringify(uriVariables as any)}`;

    if (hasQueryString) {
        return hasQueryString ? `${newUrl}&${queryString}` : newUrl;
    }
    return newUrl;

};

export class DefaultUriTemplateHandler implements UriTemplateHandlerInterface {


    expand = defaultUriTemplateFunctionHandler;


}
