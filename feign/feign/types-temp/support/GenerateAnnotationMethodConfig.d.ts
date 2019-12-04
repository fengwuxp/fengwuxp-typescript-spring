import { FeignClient } from "../FeignClient";
import { FeignClientMethodConfig } from "./FeignClientMethodConfig";
/**
 * 根据annotation生成代理服务方法的配置
 */
export declare type GenerateAnnotationMethodConfig<T extends FeignClient = FeignClient, O extends FeignClientMethodConfig = FeignClientMethodConfig> = (targetService: T, methodName: string, options: O) => void;
