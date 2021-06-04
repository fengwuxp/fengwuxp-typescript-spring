import * as webpack from "webpack";
import ExtractTextWebpackPlugin from "extract-text-webpack-plugin";
import {pathAlias} from "../configuration/CommonpPathAlias";
import {WebpackConfigurationGenerator, WebpackConfigurationGeneratorOptions} from "../WebpackConfigurationGenerator";
import * as path from "path";
import {awesomeTypescriptLoader} from "../typescript/TypescriptLoader";
import {cssModuleLoader} from "../styles/CssModuleLoader";
import PostCssLoader from "../styles/postcss/PostCssLoader";
import {lessLoader} from "../styles/less/LessLoader";
import {scssLoader} from "../styles/scss/ScssLoader";
import {uglifyJsPlugin} from "../plugins/UglifyJsPluginConfig";
import HtmlWebPackPlugin from "html-webpack-plugin";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";


export const webpack4ReactConfigurationGenerator: WebpackConfigurationGenerator = (options: WebpackConfigurationGeneratorOptions): webpack.Configuration => {


    const {
        entry,
        mode,
        outputPath,
        publicPath,
        staticResourcesBasePath,
        externals,
        env,
        htmlPlugin
    } = options;

    const isProd = mode === "production";

    //默认打包目录
    const packPath = path.resolve("src", outputPath || "../dist");

    const webpackConfiguration: webpack.Configuration = {
        entry: entry || {
            app: path.resolve('src', 'App'),
        },
        output: {
            filename: isProd ? '[name]_[hash].js' : "[name].js",
            chunkFilename: isProd ? '[name]_[hash].js' : "[name].js",
            path: packPath,
            publicPath: publicPath || "/"
        },
        resolve: {
            extensions: [".ts", ".tsx", "d.ts", ".js", ".jsx", ".css", ".scss", ".sass", ".less", ".json", ".png", "jpg", ".svg", ".jpeg", ".gif"],
            alias: pathAlias
        },
        mode,
        devtool: isProd ? false : "source-map",
        module: {
            rules: [
                // babel7Loader,
                awesomeTypescriptLoader,
                /*-----------style----------*/
                {
                    test: /\.css$/,
                    use: ExtractTextWebpackPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            cssModuleLoader,
                            PostCssLoader
                        ]
                    }),

                },
                lessLoader(),
                scssLoader(),
                {
                    test: /\.(png|jpg|jpeg|svg|gif)/,
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
                    test: /\.(woff|woff2|svg|ttf|eot)$/,
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
                                    return path.join(staticResourcesBasePath || "./", url)
                                        .replace(/\\/g, '/')
                                        .replace(/^(http:\/)/, "http://")
                                        .replace(/^(https:\/)/, "https://");
                                }
                            },

                        }
                    ]
                },
            ]
        },
        // When importing a module whose path matches one of the following, just
        // assume a corresponding global variable exists and use that instead.
        // This is important because it allows us to avoid bundling all of our
        // dependencies, which allows browsers to cache those libraries between builds.
        externals: {
            "react": "React",
            "react-dom": "ReactDOM",
            "moment": "moment",
            "rxjs": "rxjs",
            ...(externals || {})
        },

        plugins: [
            new ExtractTextWebpackPlugin({
                filename: isProd ? "[name]_[hash].css" : "[name].css",
                allChunks: true
            })
        ]
    };

    if (env) {
        webpackConfiguration.plugins.push(
            new webpack.DefinePlugin({
                'process.env': Object.keys(env)
                    .map((key) => {
                        return [key, JSON.stringify(env[key])];
                    }).reduce((prev, current) => {
                        prev[current[0]] = current[1];
                        return prev
                    }, {})
            })
        )

    }

    if (htmlPlugin) {
        webpackConfiguration.plugins.push(new HtmlWebPackPlugin(htmlPlugin));
    }

    if (isProd) {
        webpackConfiguration.optimization = { // 提取js 第三方库等
            splitChunks: {
                cacheGroups: {
                    common: {
                        chunks: 'initial', // 初始化
                        name: 'common',    // entry中js
                        enforce: true      // 强制
                    }
                }
            },
            concatenateModules: true
        };

        webpackConfiguration.plugins.push(
            uglifyJsPlugin,
            new BundleAnalyzerPlugin()
        );
    }


    return webpackConfiguration;

};
