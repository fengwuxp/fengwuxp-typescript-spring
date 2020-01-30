import {Reflection as Reflect} from '@abraham/reflection';
import {CMD_DATA_PROVIDER_KEY} from "./CmdDataProvider";

export interface CmdProviderMethodOptions {

    /**
     * 状态属性的名称
     * 默认：方法名称
     */
    propName?: string;

    /**
     * 是否忽略该方法 默认：false
     */
    ignore?: boolean;
}


/**
 * 指令数据提供者 用于增强方法描述的注解
 * @param options
 * @constructor
 */
const CmdProviderMethod = (options: CmdProviderMethodOptions) => {
    return function (target, methodName) {
        Reflect.defineMetadata(CMD_DATA_PROVIDER_KEY, {
            ...options
        }, target, methodName);
    }
};

export default CmdProviderMethod;
