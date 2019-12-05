import {FeignProxyClient} from "./FeignProxyClient";
import {FEIGN_CLINE_META_KEY} from "../constant/FeignConstVar";
import {GenerateAnnotationMethodConfig} from "./GenerateAnnotationMethodConfig";
import {FeignClientMethodConfig} from "./FeignClientMethodConfig";
import {FeignClient} from "../FeignClient";
import "reflect-metadata";

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
