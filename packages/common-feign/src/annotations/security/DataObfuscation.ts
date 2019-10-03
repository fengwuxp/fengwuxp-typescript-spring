/**
 * 数据混淆配置
 */
import {FeignClient} from "../../FeignClient";
import {defaultGenerateAnnotationMethodConfig} from "../../support/GenerateAnnotationMethodConfig";


export interface DataObfuscationOptions {

    /**
     * 请求数据中需要混淆的数据
     */
    requestFields?: string[];

    /**
     * 响应数据中被混淆的数据
     */
    responseFields?: string[]
}


/**
 * @param options 数据混淆
 * @constructor
 */
export function DataObfuscation<T extends FeignClient>(options: DataObfuscationOptions): Function {


    /**
     * decorator
     * @param  {T} target                        装饰的属性所属的类的原型，注意，不是实例后的类。如果装饰的是 T 的某个属性，这个 target 的值就是 T.prototype
     * @param  {string} name                     装饰的属性的 key
     * @param  {PropertyDescriptor} descriptor   装饰的对象的描述对象
     */
    return function (target: T, name: string, descriptor: PropertyDescriptor): T {
        defaultGenerateAnnotationMethodConfig(target, name, {
            dataObfuscationOptions: options
        });
        return target;

    }
}
