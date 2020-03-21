const {generateAliasConfig} = require("./BuildAliasHelper");

const needIncludeModuleNames = [
    'feign-boot-tarojs-stater',
    'fengwuxp-tarojs-router',
    'fengwuxp-tarojs-broadcast',
    'fengwuxp-torojs-storage',
    'fengwuxp-taro-starter',
    'taro-f2'
];
const config = {
    projectName: 'tarojs-3.x-template',
    date: '2020-1-18',
    designWidth: 750,
    deviceRatio: {
        '640': 2.34 / 2,
        '750': 1,
        '828': 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: `dist/${process.env.TARO_ENV}`,
    babel: {
        sourceMap: true,
        presets: [
            ['env', {
                modules: false
            }]
        ],
        plugins: [
            'transform-decorators-legacy',
            'transform-class-properties',
            'transform-object-rest-spread',
            [
                'transform-runtime',
                {
                    "helpers": false,
                    "polyfill": false,
                    "regenerator": true,
                    "moduleName": 'babel-runtime'
                }
            ],
            [
                'babel-plugin-rewrite-import',
                {
                    importTransformer: function (importPath,filename) {
                        console.log("====importPath===>", importPath,filename);
                        const isTaroJs = importPath.indexOf('@tarojs/taro') === 0;
                        if (isTaroJs) {
                            const taroEnv = process.env.TARO_ENV;
                            if (taroEnv === 'h5') {
                                return '@tarojs/taro-h5'
                            }
                            if (taroEnv === 'weapp') {
                                return '@tarojs/taro-weapp'
                            }
                            return importPath;
                        }
                        return importPath;
                    },
                    includePackages:needIncludeModuleNames
                }
            ]
        ]
    },
    plugins: [],
    defineConstants: {},
    copy: {
        patterns: [
            // 指定需要 copy 的目录
            {
                from: 'static_resources/',
                to: `dist/${process.env.TARO_ENV}/static_resources/`
            }
        ],
        // 全局的 ignore
        ignore: [],
        options: {}
    },
    mini: {
        postcss: {
            pxtransform: {
                enable: true,
                config: {}
            },
            url: {
                enable: true,
                config: {
                    limit: 10240 // 设定转换尺寸上限
                }
            },
            cssModules: {
                enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        },
        // compile: {
        //     include: needIncludeModuleNames
        // }
    },
    h5: {
        publicPath: '/',
        staticDirectory: 'static',
        postcss: {
            autoprefixer: {
                enable: true,
                config: {
                    browsers: [
                        'last 3 versions',
                        'Android >= 4.1',
                        'ios >= 8'
                    ]
                }
            },
            cssModules: {
                enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        },
        // esnextModules: needIncludeModuleNames,
    },
    alias: generateAliasConfig(),

}

module.exports = function (merge) {
    if (process.env.NODE_ENV === 'development') {
        return merge({}, config, require('./dev'))
    }
    return merge({}, config, require('./prod'))
}
