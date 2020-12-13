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

    /**
     * 类型变量
     */
    typeVariables?: TypeDefinition[];

    /**
     * 带泛型的名称，默认为name
     * {@link TypeDefinition#name}
     */
    genericName: string;

    /***
     * 泛型描述
     */
    genericDescription?: string;

    /**
     * 是否需要生成
     * 默认：true
     */
    needCodegen?: boolean;

    /**
     * 是否需要导入
     * 默认：true
     */
    needImport?: boolean;

}

/**
 * 方法定义
 */
export interface MethodDefinition extends CodeGenBaseDefinition {

    /**
     * 注解、元数据描述
     */
    annotations?: AnnotationDefinition[];

    /**
     * 返回值
     */
    returnType: TypeDefinition;

    /**
     * 参数
     */
    params?: Array<{ name: string, parameterType: TypeDefinition }>;
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
     * 字段类型
     */
    filedType: TypeDefinition;

    /**
     * 注解、元数据描述
     */
    annotations?: AnnotationDefinition[];

}


