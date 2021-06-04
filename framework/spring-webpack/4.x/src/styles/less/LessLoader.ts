import ExtractTextWebpackPlugin from "extract-text-webpack-plugin";
import {lessModuleLoader} from "../CssModuleLoader";
import PostCssLoader from "../postcss/PostCssLoader";
import {getThemeConfig} from "../theme/ThemeConfig";
import {genHappyPackLoaderString, getHappyPackPlugin} from "../../happypack/GetHappyPackPluginConfig";


export const lessLoader = () => {


    const themeVariables = getThemeConfig();

    return {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
            fallback: "style-loader",
            use: [
                lessModuleLoader,
                PostCssLoader,
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                        javascriptEnabled: true,
                        modifyVars: themeVariables,
                        ident: "css-loader"
                    }
                }
            ]
        })
    }
};

export const lessHappyLoader = {
    test: /\.less$/,
    use: ExtractTextWebpackPlugin.extract({
        fallback: "style-loader",
        use: [
            lessModuleLoader,
            PostCssLoader,
            genHappyPackLoaderString("less")
        ]
    })
};

// export const getHappyLessLoaderPlugin = () => {
//
//     const themeVariables = getThemeConfig();
//
//     return getHappyPackPlugin("less", [
//         {
//             loader: 'less-loader',
//             options: {
//                 sourceMap: true,
//                 javascriptEnabled: true,
//                 modifyVars: themeVariables,
//                 ident: "css-loader"
//             }
//         }
//     ], 2);
// };


