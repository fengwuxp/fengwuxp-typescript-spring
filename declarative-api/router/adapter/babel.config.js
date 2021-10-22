module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                modules: false
            }
        ],
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                corejs: false,
                // corejs: {
                //     version: 3,
                //     proposals: true
                // },
                helpers: true,
                regenerator: true,
                useESModules: false
            }
        ]
    ],
};
