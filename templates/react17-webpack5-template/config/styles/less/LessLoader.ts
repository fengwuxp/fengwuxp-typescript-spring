import {lessModuleLoader} from "../CssModuleLoader";
import PostCssLoader from "../postcss/PostCssLoader";
import {getThemeConfig} from "../theme/ThemeConfig";
import {genHappyPackLoaderString} from "../../happypack/GetHappyPackPluginConfig";
import {miniCssExtractLoader} from "../minicss";


export const lessLoader = () => {

    const themeVariables = getThemeConfig();
    return {
        test: /\.less$/,
        sideEffects: true,
        use: [
            miniCssExtractLoader(),
            lessModuleLoader,
            PostCssLoader,
            {
                loader: 'less-loader',
                options: {
                    lessOptions: {
                        javascriptEnabled: true,
                        modifyVars: themeVariables,
                    },
                    sourceMap: true
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



