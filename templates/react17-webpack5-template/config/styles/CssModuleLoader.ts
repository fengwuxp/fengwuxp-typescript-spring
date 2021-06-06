/**
 * @see https://github.com/css-modules/css-modules
 * @see https://www.npmjs.com/package/css-loader
 * 以 .module.[css|scss|less]结尾的文件要进行 css module
 * @param filepath 资源文件全路径
 */
const cssModuleConfig = (filepath) => {
    return {
        mode: 'local',
        localIdentName: '[name]__[hash:base64:5]',
        auto: new RegExp(`\\.module\\.[css|scss|less]`).test(filepath),
        exportLocalsConvention: "camelCaseOnly"
    }
}

export const cssModuleLoader = ({resource}) => ({
    loader: 'css-loader',
    ident: "css-loader",
    options: {
        importLoaders: 1,
        //判断是否需要css module
        modules: cssModuleConfig(resource)
    }
});

export const lessModuleLoader = ({resource}) => ({
    loader: 'css-loader',
    ident: "css-loader",
    options: {
        importLoaders: 2,
        //判断是否需要css module
        modules: cssModuleConfig(resource)
    }
});

export const scssModuleLoader = ({resource}) => ({
    loader: 'css-loader',
    ident: "css-loader",
    options: {
        importLoaders: 2,
        //判断是否需要css module
        modules: cssModuleConfig(resource)
    }
});
