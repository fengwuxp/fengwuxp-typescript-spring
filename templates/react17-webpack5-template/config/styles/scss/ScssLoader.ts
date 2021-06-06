import {scssModuleLoader} from "../CssModuleLoader";
import PostCssLoader from "../postcss/PostCssLoader";
import {genHappyPackLoaderString} from "../../happypack/GetHappyPackPluginConfig";
import {miniCssExtractLoader} from "../minicss";

export const scssLoader = () => {
    return {
        test: /\.s[c|a]ss$/,
        sideEffects: true,
        use: [
            miniCssExtractLoader,
            scssModuleLoader,
            PostCssLoader,
            genHappyPackLoaderString("scss")
        ]
    }
};
