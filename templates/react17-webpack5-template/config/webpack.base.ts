import * as webpack from "webpack";
import * as path from "path";
import {WebpackManifestPlugin} from "webpack-manifest-plugin";
import {httpProxyConfig} from "./http.proxy.config";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {miniCssExtractLoader} from "./styles/minicss";
import {cssModuleLoader} from "./styles//CssModuleLoader";
import PostCssLoader from "./styles//postcss/PostCssLoader";
import {lessLoader} from "./styles//less/LessLoader";
import {scssLoader} from "./styles//scss/ScssLoader";

const {TypedCssModulesPlugin} = require('typed-css-modules-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const InlineChunkHtmlPlugin = require("inline-chunk-html-plugin");

/**
 * Webpack configuration.
 *
 * @see https://webpack.js.org/configuration/
 * @param {Record<string, boolean> | undefined} env
 * @param {{ mode: "production" | "development" }} options
 * @returns {import("webpack").Configuration}
 */
export const generateWebpackConfig = (env, options): webpack.Configuration => {

    const isEnvProduction = options.mode === "production";
    const isEnvDevelopment = options.mode === "development";

    const webpackConfiguration: webpack.Configuration = {
        name: "app",
        mode: "development",
        target: "web",
        bail: true,
        entry: "./src/index.tsx",
        output: {
            path: path.resolve(__dirname, "../dist"),
            pathinfo: true,
            filename: "./js/[name].[contenthash:8].js",
            chunkFilename: "./js/[name].[contenthash:8].js",
            publicPath: "/",
            uniqueName: "app",
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
            }),
            new MiniCssExtractPlugin({
                filename: isEnvDevelopment ? "./css/[name].css" : "./css/[name].[contenthash:8].css",
                chunkFilename: isEnvDevelopment ? "./css/[name].css" : "./css/[name].[contenthash:8].css",
            }),
            new webpack.DefinePlugin({
                "process.env.APP_NAME": JSON.stringify("React App"),
                "process.env.APP_ORIGIN": JSON.stringify("http://localhost:3000"),
            }),
            new WebpackManifestPlugin({fileName: "assets.json", publicPath: "/"}),
            // new TypedCssModulesPlugin({
            //     globPattern: 'src/**/*.module.less',
            //     camelCase: true
            // })
        ],

    }

    if (isEnvDevelopment) {
        /**
         * Development server that provides live reloading.
         *
         * @see https://webpack.js.org/configuration/dev-server/
         * @type {import("webpack-dev-server").Configuration}
         */
        // @ts-ignore
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
                }),
            ],
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    commons: {
                        test: /[\\/].yarn[\\/]/,
                        name: "vendors",
                        chunks: "all",
                    },
                    styles: {
                        name: 'styles',
                        type: 'css/mini-extract',
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
            runtimeChunk: {
                name: (entrypoint) => `runtime-${entrypoint.name}`,
            }
        }
        webpackConfiguration.plugins.push(
            new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
            new BundleAnalyzerPlugin()
        )
    }

    return webpackConfiguration;
}

const getModule = () => {
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
                test: /\.(png|jpg|jpeg|gif)/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
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
