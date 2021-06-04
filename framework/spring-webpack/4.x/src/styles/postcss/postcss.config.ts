

export default {
    // https://webpack.js.org/guides/migrating/#complex-options
    ident: 'postcss',
    plugins:  [
        require('postcss-preset-env')({
            stage: 3,
        }),
        // require('postcss-import')({
        //     root: loader.resourcePath,
        // }),
        require('postcss-flexbugs-fixes'),
        require('precss'),
        //使用.browserslistrc的统一配置
        require('autoprefixer')(),
        // autoprefixer({
        //     browsers: ['last 4 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
        // }),
    ]
};
