import {FeignClient} from "../FeignClient";
import {FeignClientMethodConfig} from "./FeignClientMethodConfig";
import {FeignProxyClient} from "./FeignProxyClient";
import "reflect-metadata";
import {FEIGN_CLINE_META_KEY} from "../constant/FeignConstVar";

/**
 * 根据annotation生成代理服务方法的配置
 */
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

    if (typeof targetService[methodName] !== "function") {
        targetService[methodName] = function (...args) {
        };
    }

    const target = targetService.constructor;
    const feignClientMethodConfig: FeignClientMethodConfig = Reflect.getMetadata(FEIGN_CLINE_META_KEY, target, methodName);
    Reflect.defineMetadata(FEIGN_CLINE_META_KEY, {
        ...feignClientMethodConfig,
        ...options
    }, target, methodName);
};
