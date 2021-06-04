import merge from "lodash/merge";

const defaultBabel7Configuration = require("./babelrc7");

/**
 * 获取babel7的配置
 * @param babel7Configuration
 */
export const getBabel7Configuration = (babel7Configuration = {}) => {

    return merge(defaultBabel7Configuration, babel7Configuration);
};