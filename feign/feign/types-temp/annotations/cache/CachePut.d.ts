import { FeignClient } from "../../FeignClient";
/**
 * 缓存配置
 */
export interface CachePutOptions {
    /**
     * 缓存的key
     * 默认按照url和参数进行缓存
     */
    key?: string;
    /**
     * 生成缓存key的方法
     * @param args
     */
    generateKey?: (...args: any[]) => string;
    /**
     * 有效期，毫秒数
     * 默认：5 * 60 * 1000  5分钟
     */
    validityPeriod?: number;
}
/**
 * @param options  缓存配置
 * @constructor
 */
export declare function CachePut<T extends FeignClient>(options: CachePutOptions): Function;
