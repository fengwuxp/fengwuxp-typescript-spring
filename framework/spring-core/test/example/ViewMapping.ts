export interface ReactViewOptions {

    /**
     * 所有的页面文件默认放在views目录下
     * 默认依据文件夹名称+文件名称用 "/" 拼接而成
     */
    pathname?: string;

    /**
     * 页面的名称
     * 默认 null
     */
    name?: string;


    /**
     * 是否精确匹配路径（pathname）
     * default true
     */
    exact?: boolean;


    /**
     * 父页面
     * 默认 null
     */
    parent?: any
}


/**
 * 用来标记一个react 组件是一个视图
 * 通过 babel-plugin-spring来处理这个标记，生成对应的路由列表，并移除该装饰器
 * @scope only compiler
 * @target Class
 * @constructor
 */
export const ViewMapping = (options: ReactViewOptions): any => {

    return (target) => target;
};
