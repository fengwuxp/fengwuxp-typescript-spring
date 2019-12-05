import {ClientRequestDataValidator, ValidateInvokeOptions, ValidatorDescriptor} from "./ClientRequestDataValidator";
import schema from 'async-validator';

export default class AsyncClientRequestDataValidator implements ClientRequestDataValidator {

    validate = <T>(requestData: T, descriptor: ValidatorDescriptor<T>, options?: ValidateInvokeOptions | false): Promise<T> => {

        // Autocomplete type
        Object.keys(descriptor).forEach((key) => {
            const value = requestData[key];
            if (descriptor[key].type == null && value != null) {
                descriptor[key].type = typeof value
            }
        });
        const validator = new schema(descriptor);

        return new Promise<T>((resolve, reject) => {
            validator.validate(requestData, {
                first: true
            }, (errors, fields) => {
                if (errors) {
                    // validation failed, errors is an array of all errors
                    // fields is an object keyed by field name with an array of
                    // errors per field
                    return reject(errors[0]);
                }
                // validation passed
                resolve(requestData);
            });
        });

    };


}
