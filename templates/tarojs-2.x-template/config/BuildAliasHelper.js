const path = require('path');

const aliasDirs = [
    "config",
    "container",
    "constant",
    "components",
    "enums",
    "utils"
];

/**
 * 生成打包的路径别名配置
 * @return {{"@src": *}}
 */
const generateAliasConfig = () => {
    const alias = {
        "@src": path.resolve(__dirname, "./src"),
    };

    aliasDirs.forEach((dir) => {
        alias[`@${dir}`] = path.resolve(__dirname, './src/${dir}');
    });
    alias['fengwuxp-typescript-feign'] = path.resolve(__dirname, "node_modules", 'fengwuxp-typescript-feign', "esnext");
    return alias;
};

module.exports = {
    generateAliasConfig: generateAliasConfig
};
