/**
 * replace url path variable
 * @param uriVariables
 * @param uriVariablesIsArray
 */
import {UriVariable} from "../template/RestOperations";
import {grabUrlPathVariable} from "../constant/FeignConstVar";

// use split defaultValue
const valueSeparator = ":";

const replaceUriVariableValue = (uriVariables: UriVariable, uriVariablesIsArray: boolean) => {
    return (substring: string, ...args) => {
        let prop: any = uriVariablesIsArray ? 0 : args[0];
        if (prop == null) {
            throw new Error(`replacer string error, args=${args}`);
        }
        let defaultValue = null;
        // need parse defaultValue
        if (typeof prop === "string" && prop.indexOf(valueSeparator) > 0) {
            let [name, value] = prop.split(valueSeparator);
            prop = name;
            defaultValue = value;
        }
        const data = uriVariables[prop];
        if (data == null) {
            return defaultValue;
        }
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
 * <code>
 *     support 'a_{name:defaultValue}' format with default values
 * </code>
 * @param uriTemplate
 * @param uriVariables
 */
export const replacePathVariableValue = (uriTemplate: string, uriVariables: UriVariable) => {
    // is null
    if (uriVariables == null) {
        return uriTemplate;
    }

    // match {xxx} uri path variable
    const isExistPathVariable = grabUrlPathVariable.test(uriTemplate);
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
