import {lessModuleLoader} from "../CssModuleLoader";
import PostCssLoader from "../postcss/PostCssLoader";
import {loadThemeConfig} from "../theme/ThemeConfigLoader";
import {genHappyPackLoaderString} from "../../happypack/GetHappyPackPluginConfig";
import {miniCssExtractLoader} from "../minicss";


export const lessLoader = () => {

    const themeVariables = loadThemeConfig();
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



