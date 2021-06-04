//默认导入的模块
const DEFAULT_INCLUDE: string[] = [
    "fengwuxp_common_",
    "oak_",
    "_starter",
    "fengwuxp-spring-"
];

const includes: string[] = [
    ...DEFAULT_INCLUDE,
    ...((process.env.INCLUDE_NPM_MODULES || []) as string[])
];


/**
 * loader是否忽略该文件
 * @param path 文件路径
 * @return {boolean} true 忽略 false 不忽略
 */
export const isExclude = function (path) {

    const isWxpComponents = includes.some((item) => {
        return path.indexOf(item) >= 0;
    });

    if (isWxpComponents) {
        return false;
    }
    //是否为node_modules中的模块
    return path.indexOf("node_modules") >= 0;
};
