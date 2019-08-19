/**
 * Annotation at the field or method/constructor parameter level
 *
 * This is a decorator for marking
 *
 * @link https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/expressions.html
 *
 * 该装饰器仅用标记，在编译阶段会被替换成 @param value 表达式中所求出来的值
 * 对SPEL表达式求值的上下文可以来自 配置文件，系统变量和process.env
 *
 * 该装饰器只能用于 类的属性和setter方法 构造函数参数，方法参数上
 *
 * @param value  spring expression language
 * example:  ${spring.application.name}
 * @constructor
 */
export const Value = (value: string): Function => {
    return null
};