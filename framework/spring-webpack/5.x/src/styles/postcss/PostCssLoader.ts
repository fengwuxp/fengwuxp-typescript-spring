import * as path from "path";

/**
 * postcss-loader
 * @author wxup
 * @create 2018-09-25 11:15
 **/

const PostCssLoader = {
    loader: "postcss-loader",
    // ident: 'postcss',
    options: {
        ident: "css-loader",
        config: {
            path: path.resolve(__dirname, "../../../..") + "/"
        },
        plugins: loader => [
            require('postcss-preset-env')({
                stage: 3,
            }),
            require('postcss-import')({
                root: loader.resourcePath,
            }),
            require('postcss-flexbugs-fixes'),
            require('precss'),
            //使用.browserslistrc的统一配置
            require('autoprefixer')(),
        ]
    }
};

export default PostCssLoader;
