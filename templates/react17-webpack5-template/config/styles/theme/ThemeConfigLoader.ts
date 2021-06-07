import * as path from "path";
import {existsSync} from "fs";
import * as CSS from 'csstype';

/**
 * 探测项目的根路径
 */
const getProjectDir = () => {
    let currentPath = path.resolve(__dirname, "./");
    if (currentPath.indexOf("/node_modules/") > 0) {
        // 在 node_modules 中
        return path.resolve(__dirname, "../../../");
    }
    let maxFindCount = 3;
    let parent = currentPath;
    while (maxFindCount-- > 0) {
        parent = path.resolve(parent, "../");
        const isProjectDir = existsSync(path.join(parent, "./src")) && existsSync(path.join(parent, "./package.json"));
        if (isProjectDir) {
            return parent;
        }
    }
    throw new Error("not probe project dir");
}

/**
 * 默认的样式主题变量文件
 * 支持 ts\json\js
 */
const getThemeConfigFile = (): string => {
    const projectDir = getProjectDir();
    return ["ts","json", "js"].map((fileType) => {
        return path.resolve(projectDir, `./theme/index.${fileType}`);
    }).filter(existsSync)[0]
}

/**
 * 获取主题配置
 * @param themeFilepath    文件路径
 */
export const loadThemeConfig = <K extends keyof CSS.Properties<string | number>>(themeFilepath?: string): Record<K, string> => {
    const filepath = themeFilepath ?? getThemeConfigFile();
    console.log("theme config filepath", filepath)
    if (existsSync(filepath)) {
        const theme = require(filepath);
        return theme.default ?? theme;
    }
    return {} as any;
};
