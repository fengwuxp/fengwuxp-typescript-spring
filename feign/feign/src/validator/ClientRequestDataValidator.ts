import {RuleItem} from 'async-validator';


export type ValidatorDescriptor<T> = {

    [key in keyof T]: RuleItem;
}

/**
 * request data validator
 */
export interface ClientRequestDataValidator {


    validate: <T>(requestData: T, descriptor: ValidatorDescriptor<T>) => Promise<T>;
}
