import {CodeGenBaseDefinition} from './CodeGenBaseDefinition';
import {AnnotationDefinition} from './AnnotationDefinition';
import {ClassDefinitionType} from '../enums/ClassDefinitionType';

/**
 * 类型定义
 */
export interface TypeDefinition extends CodeGenBaseDefinition {

    /**
     * 类类型
     */
    type: ClassDefinitionType;

    /**
     * 方法列表
     */
    methods?: Array<MethodDefinition>;

    /**
     * 字段列表
     */
    fields?: Array<FiledDefinition>;

    /**
     * 注解、元数据描述
     */
    annotations?: AnnotationDefinition[];

    /**
     * 依赖列表
     */
    dependencies?: Array<TypeDefinition>;

    /**
     * 所在的包或者模块
     */
    package?: string;

    /**
     * 完整名称 {@link #package}+{@link TypeDefinition#name}
     */
    fullname?: string;
}

/**
 * 方法定义
 */
export interface MethodDefinition extends CodeGenBaseDefinition {

    /**
     * 注解、元数据描述
     */
    annotations?: AnnotationDefinition[];
}

/**
 * 字段定义
 */
export interface FiledDefinition extends CodeGenBaseDefinition {


    /**
     * 是否必填
     */
    required?: boolean;

    /**
     * 类型描述
     */
    typeDefinition: string;

    /**
     * 注解、元数据描述
     */
    annotations?: AnnotationDefinition[];

}

