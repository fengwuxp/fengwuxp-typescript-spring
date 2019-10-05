import {UriTemplateHandlerFunction, UriTemplateHandlerInterface} from "./UriTemplateHandler";
import {UriVariable} from "./RestOperations";
import {queryStringify} from "../utils/SerializeRequestBodyUtil";
import {grabUrlPathVariable, matchUrlPathVariable} from "../constant/FeignConstVar";


/**
 * replace url path variable
 * @param uriVariables
 * @param uriVariablesIsArray
 */
export const replaceUriVariableValue = (uriVariables: UriVariable, uriVariablesIsArray: boolean) => {
    return (substring: string, ...args) => {
        const prop: any = uriVariablesIsArray ? 0 : args[0];
        if (prop == null) {
            throw new Error(`replacer string error, args=${args}`);
        }
        const data = uriVariables[prop];
        if (uriVariablesIsArray) {
            // deleted dataSource prop
            (uriVariables as Array<any>).splice(prop as number, 1);
        } else {
            delete uriVariables[prop];
        }
        return data;
    };
};

export const defaultUriTemplateFunctionHandler: UriTemplateHandlerFunction = (uriTemplate: string, uriVariables: UriVariable) => {


    if (uriVariables == null) {
        return uriTemplate;
    }
    // match {xxx} uri path variable
    const isExistPathVariable = matchUrlPathVariable.test(uriTemplate);
    const uriVariablesIsArray = Array.isArray(uriVariables);
    if (isExistPathVariable) {
        // is array
        if (Object.keys(uriVariables).length === 0) {
            return uriTemplate;
        }
        // replace path variable
        uriTemplate = uriTemplate.replace(grabUrlPathVariable, replaceUriVariableValue(uriVariables, uriVariablesIsArray));
        if (Object.keys(uriVariables).length === 0) {
            //if uriVariables is empty return,else handle queryString
            return uriTemplate;
        }
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
