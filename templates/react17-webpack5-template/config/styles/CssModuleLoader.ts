/**
 * 默认  已 .module.[css|scss|less]结尾的文件要进行 css module
 */
export const cssModuleLoader = ({resource}) => ({
    loader: 'css-loader',
    ident: "css-loader",
    options: {
        importLoaders: 1,
        //判断是否需要css module
        modules: /\.module\.css/.test(resource)
    }
});

export const lessModuleLoader = ({resource}) => ({
    loader: 'css-loader',
    ident: "css-loader",
    options: {
        importLoaders: 2,
        //判断是否需要css module
        modules: /\.module\.less/.test(resource)
    }
});

export const scssModuleLoader = ({resource}) => ({
    loader: 'css-loader',
    ident: "css-loader",
    options: {
        importLoaders: 2,
        //判断是否需要css module
        modules: /\.module\.scss/.test(resource)
    }
});
