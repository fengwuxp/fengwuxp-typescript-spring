import {OpenApiCodegenOptionsAware} from "./OpenApiCodegenOptionsAware";

export interface OpenApiParser<T = any> extends OpenApiCodegenOptionsAware {

    parse: () => Promise<T>
}

/**
 * 用于初始化对应open api 相关的配置
 */
export type OpenApiConfigurer = () => void;