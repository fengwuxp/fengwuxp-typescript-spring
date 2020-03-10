import {FeignClient} from "../../FeignClient";
import {defaultGenerateAnnotationMethodConfig} from "../../support/DefaultGenerateAnnotationMethodConfig";

/**
 * 需要自动上传配置
 */
export interface AutoFileUploadOptions<T = any> {

    /**
     * 需要执行上传动作的字段
     */
    fields: Array<keyof T> | Array<string>;

    /**
     * 上传的rul
     */
    url?: string;
}

/**
 * @param options  需要自动上传
 * @constructor
 */
export const FileUpload = <REQ = any, T extends FeignClient = FeignClient>(options: AutoFileUploadOptions<REQ>): Function => {


    /**
     * decorator
     * @param  {T} target                        装饰的属性所属的类的原型，注意，不是实例后的类。如果装饰的是 T 的某个属性，这个 target 的值就是 T.prototype
     * @param  {string} name                     装饰的属性的 key
     * @param  {PropertyDescriptor} descriptor   装饰的对象的描述对象
     */
    return function (target: T, name: string, descriptor: PropertyDescriptor): T {
        defaultGenerateAnnotationMethodConfig(target, name, {
            fileUploadOptions: options
        });
        return target;

    }
};
