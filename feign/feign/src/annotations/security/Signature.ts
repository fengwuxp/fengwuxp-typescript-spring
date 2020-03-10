import {FeignClient} from "../../FeignClient";
import {defaultGenerateAnnotationMethodConfig} from "../../support/DefaultGenerateAnnotationMethodConfig";


/**
 * 签名配置
 */
export interface SignatureOptions<T = any> {

    /**
     * 要签名的字段名称
     */
    fields: Array<keyof T> | Array<string>;
}


/**
 * @param options 签名配置
 * @constructor
 */
export const Signature = <REQ = any, T extends FeignClient = FeignClient>(options: SignatureOptions<REQ>): Function => {


    /**
     * decorator
     * @param  {T} target                        装饰的属性所属的类的原型，注意，不是实例后的类。如果装饰的是 T 的某个属性，这个 target 的值就是 T.prototype
     * @param  {string} name                     装饰的属性的 key
     * @param  {PropertyDescriptor} descriptor   装饰的对象的描述对象
     */
    return function (target: T, name: string, descriptor: PropertyDescriptor): T {
        defaultGenerateAnnotationMethodConfig(target, name, {
            signature: options
        });
        return target;

    }
}
