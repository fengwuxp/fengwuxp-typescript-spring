/**
 * replace url path variable
 * @param uriVariables
 * @param uriVariablesIsArray
 */
import {UriVariable} from "../template/RestOperations";
import {grabUrlPathVariable, matchUrlPathVariable} from "../constant/FeignConstVar";


const replaceUriVariableValue = (uriVariables: UriVariable, uriVariablesIsArray: boolean) => {
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
/**
 * replace the value of bdc in the form ‘a_{bdc}’
 * @param uriTemplate
 * @param uriVariables
 */
export const replacePathVariableValue = (uriTemplate: string, uriVariables: UriVariable) => {
    // is empty object
    if (uriVariables == null || Object.keys(uriVariables).length === 0) {
        return uriTemplate;
    }

    // match {xxx} uri path variable
    const isExistPathVariable = matchUrlPathVariable.test(uriTemplate);
    if (!isExistPathVariable) {
        return uriTemplate;
    }

    const uriVariablesIsArray = Array.isArray(uriVariables);
    // replace path variable
    uriTemplate = uriTemplate.replace(grabUrlPathVariable, replaceUriVariableValue(uriVariables, uriVariablesIsArray));
    if (Object.keys(uriVariables).length === 0) {
        //if uriVariables is empty return,else handle queryString
        return uriTemplate;
    }
    return uriTemplate
};
