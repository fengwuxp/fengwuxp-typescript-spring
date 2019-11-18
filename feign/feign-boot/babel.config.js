module.exports = {
    "presets": [
        [
            "@babel/env",
            {
                modules: false,
                targets: {
                    "browsers": [
                        "> 1%",
                        "last 2 versions",
                        "not ie <= 8"
                    ]
                },
                useBuiltIns: "usage",
                corejs: 3
            }
        ],
        "@babel/typescript"
    ],

    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                // "absoluteRuntime": false,
                "corejs": 3,
                "helpers": true,
                "regenerator": true,
                "useESModules": true
            }
        ]
    ]
};
