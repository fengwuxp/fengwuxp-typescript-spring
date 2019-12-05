import {RuleItem} from 'async-validator';


type ValidatorDescriptorAll<T> = {

    [key in keyof T]: RuleItem;
}
export type ValidatorDescriptor<T> = Partial<ValidatorDescriptorAll<T>>;

export interface ValidateInvokeOptions {

    /**
     * default true
     */
    useToast?: boolean;
}

/**
 * request data validator
 */
export interface ClientRequestDataValidator {


    /**
     *
     * @param requestData  validate data source
     * @param descriptor   validate rule desc
     * @param options      invoke options
     */
    validate: <T>(requestData: T, descriptor: ValidatorDescriptor<T>, options?: ValidateInvokeOptions | false) => Promise<T>;
}
