import * as path from "path";

//导入语句的别名匹配工具


export const isAliasImport = (importPath: string) => {
    if (!importPath.startsWith("@")) {
        return false;
    }
    return true;
};

/**
 * 正常化导入语句
 * @param aliasBasePath
 * @param aliasConfiguration
 * @param importPath
 */
export const normalizeAliasImportPath = (
    aliasBasePath: string,
    aliasConfiguration: {
        [key: string]: string[];
    }, importPath: string) => {
    if (aliasBasePath == null || aliasConfiguration == null) {
        return importPath
    }
    //判断是否为别名导入
    if (!isAliasImport(importPath)) {
        return importPath;
    }

    const config = Object.keys(aliasConfiguration).map((aliasName) => {
        const items = aliasConfiguration[aliasName].map((prefix) => {
            return prefix.substring(0, prefix.length - 1);
        });
        const newConfig = {};
        //去掉最后一个*号
        aliasName = aliasName.substring(0, aliasName.length - 1);

        newConfig[aliasName] = items;

        return newConfig;
    }).reduce((prev, crrent) => {
        return {
            ...prev,
            ...crrent
        }
    }, {});

    //找到匹配的别名
    const aliasName = Object.keys(config).find((aliasName) => {

        return importPath.startsWith(aliasName);
    });
    if (aliasName == null) {
        throw new Error(`未找到该别名配置信息 -> ${importPath}`)
        // return importPath;
    }
    const aliasPrefixList = config[aliasName];

    //默认获取第一个，然后转换为绝对路径
    const _importPath = `${aliasPrefixList[0]}${importPath.replace(aliasName, "")}`;

    return path.resolve(aliasBasePath, _importPath);

};