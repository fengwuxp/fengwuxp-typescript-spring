// import ExtractTextWebpackPlugin from "extract-text-webpack-plugin";
import {lessModuleLoader} from "../CssModuleLoader";
import PostCssLoader from "../postcss/PostCssLoader";
import {getThemeConfig} from "../theme/ThemeConfig";
import {genHappyPackLoaderString, getHappyPackPlugin} from "../../happypack/GetHappyPackPluginConfig";
import {miniCssExtractLoader} from "../minicss";


export const lessLoader = () => {


    const themeVariables = getThemeConfig();

    return {
        test: /\.less$/,
        use: [
            miniCssExtractLoader,
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
    }
};

export const lessHappyLoader = {
    test: /\.less$/,
    use: [
        miniCssExtractLoader,
        lessModuleLoader,
        PostCssLoader,
        genHappyPackLoaderString("less")
    ]
};



