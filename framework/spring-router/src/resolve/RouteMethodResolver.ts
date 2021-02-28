/**
 * 路由方法解析
 */
export interface RouteMethodResolver {

    /**
     * 页面uri 转方法名称
     * @param uri
     */
    uriToMethodName: (uri: string) => string;


    /**
     * 方法名称转页面uri
     * @param methodName
     */
    methodNameToUri: (methodName: string) => string;
}