import {ConditionType} from "fengwuxp-spring-context/src/condition/ConditionType";

/**
 * 视图映射配置
 */
export interface ViewMappingOptions<P = {}, S = {}> {

    /**
     * 所有的页面文件默认放在views目录下
     * 默认依据文件夹名称+文件名称用 "/" 拼接而成
     */
    pathname?: string;

    /**
     * 页面的名称
     * 默认 null
     * 支持表达式
     */
    name?: string;


    /**
     * 是否精确匹配路径（pathname）
     * default true
     */
    exact?: boolean;

    /**
     * 页面接收的查询参数
     */
    queryParams?: P;

    /**
     * 页面接收的状态
     */
    state?: S;

    /**
     * 进入页面的条件，例如进行登陆检查、权限检查等
     * default true
     * @param context 应用上下文
     */
    condition?: ConditionType;
}


/**
 * 视图映射
 */
export type ViewMapping<T extends ViewMappingOptions = ViewMappingOptions, V = any> = (mappingOptions: T) => V;
