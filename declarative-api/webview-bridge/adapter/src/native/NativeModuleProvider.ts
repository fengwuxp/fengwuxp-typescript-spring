

export interface OpenModuleInterface {
    [key: string]: any
}

const MODULE_STORAGE: Map<string, any> = new Map<string, any>();

/**
 * 注册模块
 * @param moduleName
 * @param module
 */
export const registerModule = (moduleName: string, module: OpenModuleInterface) => {

    MODULE_STORAGE.set(moduleName, module);
};

/**
 * 获取模块
 * @param module
 */
export const getModule = <T extends OpenModuleInterface>(module: string): T => {
    return MODULE_STORAGE.get(module);
};
