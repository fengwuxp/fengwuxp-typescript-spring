import  ExtractTextWebpackPlugin from "extract-text-webpack-plugin";
import { scssModuleLoader} from "../CssModuleLoader";
import PostCssLoader from "../postcss/PostCssLoader";
import {genHappyPackLoaderString, getHappyPackPlugin} from "../../happypack/GetHappyPackPluginConfig";

export const scssLoader = () => {


    return {
        test: /\.s[c|a]ss$/,
        use: ExtractTextWebpackPlugin.extract({
            fallback: "style-loader",
            use: [
                scssModuleLoader,
                PostCssLoader,
                genHappyPackLoaderString("scss")
            ]
        })
    }
};