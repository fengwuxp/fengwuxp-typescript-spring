module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": false,
                "targets": {
                    "browsers": [">1%", "last 2 versions"]
                },
            }
        ],
    ],
    "plugins": [
        // [
        //     "@babel/plugin-transform-runtime",
        //     {
        //         corejs: 2,
        //         // corejs: {
        //         //     version: 3,
        //         //     proposals: true
        //         // },
        //         helpers: true,
        //         regenerator: true,
        //         useESModules: false
        //     }
        // ]
        ["@babel/plugin-transform-runtime", {
            // 可选 false | 2 | 3,
            corejs: false,
            helpers: true,
            regenerator: true,
            useESModules: true
        }]

    ],
};
