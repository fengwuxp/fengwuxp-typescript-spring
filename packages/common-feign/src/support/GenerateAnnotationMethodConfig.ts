/**
 * 根据annotation生成代理服务方法的配置
 */
import {FeignClient} from "../FeignClient";
import {FeignClientMethodConfig} from "./FeignClientMethodConfig";
import {FeignProxyClient} from "./FeignProxyClient";


export type GenerateAnnotationMethodConfig<T extends FeignClient = FeignClient,
    O extends FeignClientMethodConfig = FeignClientMethodConfig> =
    (targetService: T, methodName: string, options: O) => void;


/**
 * 默认的代理服务方法配置生成
 * @param targetService
 * @param methodName
 * @param options
 */
export const defaultGenerateAnnotationMethodConfig: GenerateAnnotationMethodConfig<FeignClient,
    FeignClientMethodConfig> = (targetService: FeignProxyClient,
                                methodName: string,
                                options: FeignClientMethodConfig) => {
    const oldFn = targetService[methodName];

    targetService[methodName] = function (...args) {

        if (typeof oldFn === "function") {
            //保证this 不丢失
            oldFn.apply(this, [...args]);
        }
        const methodConfig = this.getServiceMethodConfig(methodName);
        this.setServiceMethodConfig(methodName, {
            ...methodConfig,
            ...options
        });
    }
};
