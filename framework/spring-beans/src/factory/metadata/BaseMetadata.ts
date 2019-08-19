import {AccessPermission} from "./AccessPermission";
import {ExportType} from "./ExportType";
import {
    File
} from "@babel/types";

/**
 * 基础的元数据信息
 */
export interface BaseMetadata {

    /**
     * 名称
     */
    name: string;

    /**
     * 额外标签
     */
    tas: Map<string, any>;

    /**
     * 访问权限控制
     */
    accessPermission: AccessPermission;

    /**
     * 注释
     */
    comments: string[];

    /**
     * 是否默认导出
     */
    isExportDefault: boolean;
}

/**
 * 参数元数据信息
 */
export interface ParameterMetadata extends ClassMetadata {

}

/**
 * 装饰器元数据信息
 */
export interface AnnotationMetadata extends BaseMetadata {

}

/**
 * 方法元数据信息
 */
export interface MethodMetadata extends BaseMetadata {

    /**
     * 参数列表
     */
    params: ParameterMetadata[];

    /**
     * 返回值类型，多个表示有泛型
     */
    returnTypes: ClassMetadata[];
}

/**
 * filed 元数据信息
 */
export interface FiledMetadata extends BaseMetadata {

    /**
     * 域对象类型列表
     * 大于一个表示有泛型泛型
     */
    filedTypes: ClassMetadata[];

    /**
     * 注解列表
     */
    annotations: AnnotationMetadata[];


}

/**
 * 类的元数据信息
 * class metadata
 */
export interface ClassMetadata extends BaseMetadata {

    /**
     * 原始文件
     */
    source: File;

    /**
     * 注解列表
     */
    annotations: AnnotationMetadata[];

    /**
     *导出类型
     */
    exportType: ExportType;

    /**
     * 是否抽象的
     */
    isAbstract: boolean;

    /**
     * 超类
     */
    superClass: ClassMetadata;

    /**
     * 接口
     */
    interfaces: ClassMetadata[];

    /**
     * 类路径
     */
    packagePtah: string;

    /**
     * 依赖列表
     */
    dependencies: Map<string, ClassMetadata[]>;

    /**
     * 类型变量
     */
    typeVariables: string[];
}