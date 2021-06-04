import * as webpack from "webpack";
import * as path from "path";
import {Entry, EntryFunc} from "webpack";
import {Output} from "webpack";
import {Plugin} from "webpack";
import {uglifyJsPlugin} from "../plugins/UglifyJsPluginConfig";
import {awesomeTypescriptLoader} from "../typescript/TypescriptLoader";
import {babel7Loader} from "../babel/BabelLoader";

interface GetLibraryTargetConfigOptions {

    entry: string | string[] | Entry | EntryFunc;

    //生产环境
    production: boolean;

    /**
     * 输出目录 默认 lib
     */
    outputDir?: string;

    output?: Output;

    plugins?: Plugin[],

    splitChunkName?: string;
}


/**
 * 获取webpack library的打包配置
 * @param options
 */
export const webpack4LibraryConfigurationGenerator = (options: GetLibraryTargetConfigOptions): webpack.Configuration => {

    const packPath = path.resolve(options.outputDir || "./lib");

    const isProduction = options.production;
    const webpackConfig: webpack.Configuration = {
        mode: isProduction ? "production" : "development",
        entry: options.entry,
        output: options.output || {
            filename: '[name].js',
            chunkFilename: '[name].js',
            path: packPath,
            libraryTarget: "commonjs"
        },
        resolve: {
            extensions: [".ts", ".tsx", "d.ts", ".js"],
        },
        devtool: isProduction ? false : "source-map",
        module: {
            rules: [
                babel7Loader,
                awesomeTypescriptLoader
            ]
        },

        plugins: [
            ...(options.plugins || []),
            isProduction ? uglifyJsPlugin : null
        ].filter(item => item != null)
    };

    if (isProduction) {
        //覆盖掉默认的压缩配置（默认的压缩配置会压缩掉类名称）
        // 提取js 第三方库等
        webpackConfig.optimization = {
            splitChunks: {
                name: options.splitChunkName || "index",
                cacheGroups: {
                    common: {
                        chunks: 'initial', // 必须三选一： "initial"(初始化) | "all" | "async"(默认就是异步)
                        // name: 'index',    // entry中js
                        enforce: true,      // 强制
                        test: /node_modules/,     // 正则规则验证，如果符合就提取 chunk
                        minSize: 0,
                        minChunks: 1,
                        reuseExistingChunk: true   // 可设置是否重用已用chunk 不再创建新的chunk
                    }
                }
            },
            concatenateModules: true,
            minimizer: []
        };
    }

    return webpackConfig;
};
