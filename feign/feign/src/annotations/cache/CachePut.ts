import {FeignClient} from "../../FeignClient";
import {registerAnnotationMetadata} from "../../support/AnnotationMetadataRegister";

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
    generateKey?: (...args) => string;


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
export function CachePut<T extends FeignClient>(options: CachePutOptions): Function {


    /**
     * decorator
     * @param  {T} target                        装饰的属性所属的类的原型，注意，不是实例后的类。如果装饰的是 T 的某个属性，这个 target 的值就是 T.prototype
     * @param  {string} name                     装饰的属性的 key
     * @param  {PropertyDescriptor} descriptor   装饰的对象的描述对象
     */
    return function (target: T, name: string, descriptor: PropertyDescriptor): T {
        registerAnnotationMetadata(target, name, {
            cacheOptions: options
        });
        return target;

    }
}
