import {ClientRequestDataValidator, ValidateInvokeOptions, ValidatorDescriptor} from "./ClientRequestDataValidator";
import AsyncClientRequestDataValidator from "./AsyncClientRequestDataValidator";

export default class ClientRequestDataValidatorHolder {

    private static clientRequestDataValidator: ClientRequestDataValidator = new AsyncClientRequestDataValidator();


    public static setClientRequestDataValidator = (clientRequestDataValidator: ClientRequestDataValidator) => {
        ClientRequestDataValidatorHolder.clientRequestDataValidator = clientRequestDataValidator;
    };

    public static validate = <T>(requestData: T, descriptor: ValidatorDescriptor<T>, options?: ValidateInvokeOptions | false): Promise<T> => {
        return ClientRequestDataValidatorHolder.clientRequestDataValidator.validate<T>(requestData, descriptor);
    }
}
