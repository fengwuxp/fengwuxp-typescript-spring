import {ClientRequestDataValidator, ValidateInvokeOptions, ValidatorDescriptor} from "./ClientRequestDataValidator";
import AsyncClientRequestDataValidator from "./AsyncClientRequestDataValidator";
import FeignConfigurationRegistry from "../configuration/FeignConfigurationRegistry";
import {invokeFunctionInterface} from "../utils/InvokeFunctionInterface";
import FeignUIToastHolder, {FeignUIToast, FeignUIToastFunction, FeignUIToastInterface} from "../ui/FeignUIToast";
import StringUtils from "fengwuxp-common-utils/lib/string/StringUtils";

export default class ClientRequestDataValidatorHolder {

    private static clientRequestDataValidator: ClientRequestDataValidator = new AsyncClientRequestDataValidator();


    public static setClientRequestDataValidator = (clientRequestDataValidator: ClientRequestDataValidator) => {
        ClientRequestDataValidatorHolder.clientRequestDataValidator = clientRequestDataValidator;
    };

    public static validate = <T>(requestData: T, descriptor: ValidatorDescriptor<T>, options?: ValidateInvokeOptions | false): Promise<T> => {
        return ClientRequestDataValidatorHolder.clientRequestDataValidator.validate<T>(requestData, descriptor).catch((error) => {
            if (error == null) {
                return Promise.reject(error);
            }
            const needShowToast = options == null || (options != false && options.useToast != false);
            if (needShowToast) {
                const feignUIToast: FeignUIToast = FeignUIToastHolder.getFeignUIToast();
                const message = typeof error === "string" ? error : error.message;
                if (feignUIToast != null && StringUtils.hasText(message)) {
                    invokeFunctionInterface<FeignUIToastFunction, FeignUIToastInterface>(feignUIToast).toast(message);
                }
            }
            return Promise.reject(error);
        });
    }
}
