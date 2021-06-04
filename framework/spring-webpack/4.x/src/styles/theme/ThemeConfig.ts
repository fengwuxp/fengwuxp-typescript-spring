import * as path from "path";
import {existsSync} from "fs";
import * as CSS from 'csstype';

const themeJSONFilePath = path.resolve("./theme/index.json");

/**
 * 默认的样式主题变量文件
 * 支持js文件和json文件
 */
const DEFAULT_THEME_PATH = existsSync(themeJSONFilePath) ? themeJSONFilePath : path.resolve("./theme/index.js");


/**
 * 获取主题配置
 * @param themeFilePath    文件路径
 * @param isPackage  是否配置在package.json文件中
 */
export const getThemeConfig = <K extends keyof CSS.Properties<string | number>>(
    themeFilePath = path.resolve(DEFAULT_THEME_PATH), isPackage = false): Record<K, string> => {

    let theme = {};
    if (isPackage) {
        //配置在package.json文件中
        const pkg = existsSync(themeFilePath) ? require(themeFilePath) : {};
        if (pkg.theme && typeof (pkg.theme) === 'string') {
            let cfgPath = pkg.theme;
            // relative themeFilePath
            if (cfgPath.charAt(0) === '.') {
                cfgPath = path.resolve(global['args'].cwd, cfgPath);
            }
            theme = require(cfgPath);
        } else if (pkg.theme && typeof (pkg.theme) === 'object') {
            theme = pkg.theme;
        }
    } else {
        //使用单独的js 或 json 文件
        theme = existsSync(themeFilePath) ? require(themeFilePath) : {};
    }

    return theme as any;
};
