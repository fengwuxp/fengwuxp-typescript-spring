import {FeignClient} from "../../FeignClient";
import {defaultGenerateAnnotationMethodConfig} from "../../support/DefaultGenerateAnnotationMethodConfig";
import {HttpRetryOptions} from "../../client/HttpRetryOptions";


export const defaultOptions: HttpRetryOptions = {
    retries: 1,
    maxTimeout: 15000,
    delay: 100
};

/**
 * 请求重试
 * @param options
 * @constructor
 */
export const FeignRetry = <T extends FeignClient>(options: HttpRetryOptions): Function => {


    /**
     * decorator
     * @param  {T} target                        装饰的属性所属的类的原型，注意，不是实例后的类。如果装饰的是 T 的某个属性，这个 target 的值就是 T.prototype
     * @param  {string} name                     装饰的属性的 key
     * @param  {PropertyDescriptor} descriptor   装饰的对象的描述对象
     */
    return function (target: T, name: string, descriptor: PropertyDescriptor): T {
        defaultGenerateAnnotationMethodConfig(target, name, {
            retryOptions: {
                ...defaultOptions,
                ...options
            }
        });
        return target;

    }
}
