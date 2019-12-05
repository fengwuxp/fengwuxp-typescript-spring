import {ClientRequestDataValidator, ValidatorDescriptor} from "./ClientRequestDataValidator";
import schema from 'async-validator';

export default class AsyncClientRequestDataValidator implements ClientRequestDataValidator {

    validate = <T>(requestData: T, descriptor: ValidatorDescriptor<T>): Promise<T> => {

        const validator = new schema(descriptor);
        return new Promise<T>((resolve, reject) => {
            validator.validate(schema, {
                first: true
            }, (errors, fields) => {
                if (errors) {
                    // validation failed, errors is an array of all errors
                    // fields is an object keyed by field name with an array of
                    // errors per field
                    return reject(errors);
                }
                // validation passed
                resolve(requestData);
            });
        });

    };


}
