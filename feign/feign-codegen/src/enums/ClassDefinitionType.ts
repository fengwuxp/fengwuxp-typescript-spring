/**
 * 类定义的类型
 */
export enum ClassDefinitionType {

    /**
     * 类
     */
    CLASS,

    /**
     * 枚举
     */
    ENUM,

    /**
     * 接口
     */
    INTERFACE,

    /**
     * 注解
     */
    ANNOTATION
}

export enum OpenApiClassType {

    OBJECT = 'object',

    ARRAY = 'array',

    ENUM = 'enum',

    BOOLEAN = "boolean",

    NUMBER = 'number',

    INTEGER = 'integer',

    STRING = 'string',

    DATE = 'date',

}