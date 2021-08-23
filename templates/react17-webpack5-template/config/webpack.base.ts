import * as webpack from "webpack";
import * as path from "path";
import {WebpackManifestPlugin} from "webpack-manifest-plugin";
import {httpProxyConfig} from "./http.proxy.config";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import {miniCssExtractLoader} from "./styles/minicss";
import {cssModuleLoader} from "./styles//CssModuleLoader";
import PostCssLoader from "./styles//postcss/PostCssLoader";
import {lessLoader} from "./styles//less/LessLoader";
import {scssLoader} from "./styles//scss/ScssLoader";
import envConfig from "./env";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const InlineChunkHtmlPlugin = require("inline-chunk-html-plugin");


const resolveProcessEvnConfig = (config) => {
    console.log("process.env.profile", process.env.profile);
    return Object.keys(config).map(key => {
        return {
            [`process.env.${key}`]: JSON.stringify(config[key])
        }
    }).reduce((prevValue, currentValue) => {
        return {
            ...currentValue,
            ...prevValue
        }
    });
}

/**
 * Webpack configuration.
 *
 * @see https://webpack.js.org/configuration/
 * @param {Record<string, boolean> | undefined} env
 * @param {{ mode: "production" | "development" }} options
 * @returns {import("webpack").Configuration}
 */
export const generateWebpackConfig = (env, options): webpack.Configuration => {
    const webpackMode = options.mode ?? "development";
    const isEnvProduction = webpackMode === "production";
    const isEnvDevelopment = webpackMode === "development";
    console.log("webpackMode", webpackMode);

    const webpackConfiguration: webpack.Configuration = {
        name: "app",
        mode: webpackMode,
        target: "web",
        bail: true,
        entry: {
            app: "./src/index.tsx",
        },
        output: {
            path: path.resolve(__dirname, "../dist"),
            pathinfo: true,
            filename: "./js/[name].[contenthash:8].js",
            chunkFilename: "./js/[name].[contenthash:8].js",
            publicPath: "/"
        },
        module: getModule(),
        devtool: isEnvProduction ? "source-map" : "cheap-module-source-map",
        performance: {
            maxAssetSize: 650 * 1024,
            maxEntrypointSize: 650 * 1024,
        },
        resolve: {
            extensions: [".ts", ".tsx", "d.ts", ".js", "json", ".vue", ".css", ".less", ".scss", ".png", "jpg", ".jpeg", ".gif", ".svg"],
            alias: {
                '@': path.resolve(__dirname, "../src")
            }
        },
        plugins: [
            // Generates an `index.html` file with the <script> injected.
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(__dirname, "../public/index.html"),
                ...(isEnvProduction && {
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true,
                        },
                    }
                ),
                favicon: path.resolve(__dirname, "../public/favicon.ico"),
                hash: false, // 防止缓存，在引入的文件后面加hash (PWA就是要缓存，这里设置为false)
                // 正式环境，把注册service-worker的代码加入到index.html中
                registerServiceWorker: `<script>
                      if ("serviceWorker" in navigator) {
                        window.addEventListener("load", () => {
                          navigator.serviceWorker.register("./service-worker.js");
                        });
                      }
                      </script>`
            }),
            new MiniCssExtractPlugin({
                filename: isEnvDevelopment ? "./css/[name].css" : "./css/[name].[contenthash:8].css",
                chunkFilename: isEnvDevelopment ? "./css/[name].css" : "./css/[name].[contenthash:8].css",
            }),
            new webpack.DefinePlugin(resolveProcessEvnConfig(envConfig[process.env.profile ?? 'dev'])),
            new WebpackManifestPlugin({fileName: "assets.json", publicPath: "/"}),
            // https://blog.csdn.net/qinjm8888/article/details/83377352
            new webpack.ContextReplacementPlugin(
                /moment[/\\]locale$/,
                /zh-cn/,
            ),
        ],

    }

    if (isEnvDevelopment) {
        /**
         * Development server that provides live reloading.
         *
         * @see https://webpack.js.org/configuration/dev-server/
         * @type {import("webpack-dev-server").Configuration}
         */
        webpackConfiguration.devServer = {
            contentBase: path.resolve(__dirname, "../public"),
            compress: true,
            historyApiFallback: {disableDotRule: true},
            port: 9000,
            hot: true,
            proxy: httpProxyConfig
        }
        webpackConfiguration.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        )
    }

    if (isEnvProduction) {
        webpackConfiguration.optimization = {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {ecma: 2015},
                        compress: {
                            ecma: 5,
                            drop_console: true,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {safari10: true},
                        keep_classnames: false,
                        keep_fnames: false,
                        output: {ecma: 5, comments: false, ascii_only: true},
                    },
                    extractComments: false,
                }),
            ],
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    vendor: {
                        test: /[\\/].yarn[\\/]/,
                        //引入的库是从node_modules引入，就分割库代码到当前组
                        // test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial',
                        priority: 2,
                        minChunks: 2
                    },
                    common: {
                        test: /.js$/,
                        name: 'common',
                        chunks: 'initial',
                        priority: 1,
                        minChunks: 2
                    }
                }
            },
        }
        webpackConfiguration.plugins.push(
            new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
            new OptimizeCssAssetsPlugin()
        )
    }
    if (process.env.analyze === "true") {
        webpackConfiguration.plugins.push(new BundleAnalyzerPlugin());
    }

    return webpackConfiguration;
}

const getModule = (): any => {
    return {
        rules: [
            {
                test: /\.(js|mjs|ts|tsx)$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    babelrc: true,
                    cacheDirectory: ".cache/babel-loader",
                    cacheCompression: false,
                    compact: false,
                    sourceType: "unambiguous",
                },
            },
            /*-----------style----------*/
            {
                test: /\.css$/,
                sideEffects: true,
                use: [
                    miniCssExtractLoader,
                    cssModuleLoader,
                    PostCssLoader
                ]
            },
            lessLoader(),
            scssLoader(),
            {
                test: /\.svg$/,
                use: [
                    '@svgr/webpack',
                    "url-loader"
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif|webp)/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: 'images/[name].[hash:8].[ext]',
                            limit: 1024 * 5
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        //项目设置打包到dist下的fonts文件夹下
                        options: {
                            name: 'fonts/[name].[hash:8].[ext]',
                            //10kb以下的直接打包到css文件中
                            limit: 1024 * 10,
                            //返回最终的资源相对路径
                            publicPath(url) {
                                //使用全局变量来传递 资源根路径
                                return path.join("./", url)
                                    .replace(/\\/g, '/')
                                    .replace(/^(http:\/)/, "http://")
                                    .replace(/^(https:\/)/, "https://");
                            }
                        },
                    }
                ]
            },
        ],
    };
}
