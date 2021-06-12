/*** Babel configuration.
 *
 * @see https://babeljs.io/docs/en/options
 * @returns {import("@babel/core").TransformOptions}
 */
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            // https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/plugins.json#L32
            {
                targets: {browsers: ['chrome >= 47']},
                useBuiltIns: 'usage',
                corejs: 3,
                // modules: false,
                // shippedProposals:true
                // useBuiltins: "usage"
                // include:[
                //     "es7.array"
                // ]
            }
        ],
        '@babel/preset-typescript',
        "@babel/preset-react"
    ],
    plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread",
        [
            "@babel/plugin-proposal-decorators",
            {
                legacy: true
            }
        ],
        "@babel/plugin-proposal-json-strings",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        "@babel/plugin-transform-async-to-generator",
        "@babel/plugin-transform-regenerator",
        [
            "@babel/plugin-transform-runtime",
            {
                // corejs: 2,  //false or 2
                helpers: false,
                regenerator: true,
            }
        ],
        [
            "babel-plugin-import",
            {
                libraryName: "antd",
                libraryDirectory: "es",
                style: true
            },
            "antd",
        ],
        [
            "babel-plugin-import",
            {
                libraryName: "@ant-design/icons",
                camel2DashComponentName: false,
                libraryDirectory: "lib/icons",
                // custom: function (name, file) {
                //     if (name === "Icon") {
                //         return `@ant-design/icons/es/${name}`;
                //     }
                //     return `@ant-design/icons/es/icons/${name}`
                // }
            },
            "@ant-design/icons"
        ],
    ]
};
