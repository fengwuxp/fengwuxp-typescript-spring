import { GenerateAnnotationMethodConfig } from "./GenerateAnnotationMethodConfig";
import { FeignClientMethodConfig } from "./FeignClientMethodConfig";
import { FeignClient } from "../FeignClient";
import "reflect-metadata";
/**
 * 默认的代理服务方法配置生成
 * @param targetService
 * @param methodName
 * @param options
 */
export declare const defaultGenerateAnnotationMethodConfig: GenerateAnnotationMethodConfig<FeignClient, FeignClientMethodConfig>;
