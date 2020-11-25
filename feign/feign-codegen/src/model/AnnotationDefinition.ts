import {CodeGenBaseDefinition} from "./CodeGenBaseDefinition";

/**
 * 注解定义
 */
export interface AnnotationDefinition extends CodeGenBaseDefinition {

    /**
     * 命名参数
     */
    namedArguments: Record<string, string>;

    /**
     * 位置参数
     */
    positionArguments: string[];

}