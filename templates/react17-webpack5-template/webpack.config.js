require("@babel/register")({
    extensions: [".ts"],
    // only: [
    //     // File paths that **do not** return true are not compiled
    //     function (filepath) {
    //         return filepath.indexOf("/config/") > 0;
    //     },
    // ],
    cache: false
});
const {generateWebpackConfig} = require("./config/webpack.base");

/**
 * Webpack configuration.
 *
 * @see https://webpack.js.org/configuration/
 * @param {Record<string, boolean> | undefined} envName
 * @param {{ mode: "production" | "development" }} options
 * @returns {import("webpack").Configuration}
 */
module.exports = function config(env, options) {
    return generateWebpackConfig(env, options);
};
