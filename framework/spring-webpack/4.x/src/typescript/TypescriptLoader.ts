import * as path from "path";
import {LoaderConfig} from "awesome-typescript-loader/dist/interfaces";
import {isExclude} from "../hepler/WebpackLoaderHelper";
import {getBabel7Configuration} from "../babel/GetBabelConfiguration";

//导入tsconfig配置文件
// const tsConfig = require(path.resolve("./tsconfig.json"));
//tsconfig.json中配置target:es5
//支持es6打包，如果是 target=es则加入babel
// const isEs5 = tsConfig.compilerOptions.target === "es5";
// const options: LoaderConfig = isEs5 ? {
//     useBabel: true,
//     useCache: true,
//     babelOptions: {
//         babelrc: true
//     },
//     babelCore: "@babel/core"
// } : {
//     useBabel: false,
//     useCache: true
// };

export const awesomeTypescriptLoader = {
    test: /\.ts[x]?$/,
    exclude: isExclude,
    use: [
        {
            loader: "babel-loader"
        },
        {

            loader: "awesome-typescript-loader",
            options: {
                useBabel: false,
                useCache: true
            }
        }
    ]
};


