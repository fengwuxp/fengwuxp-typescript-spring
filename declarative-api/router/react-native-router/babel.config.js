module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                modules: false
                // corejs: 3,
                // useBuiltIns: 'usage',
            }
        ],
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                corejs: 2,
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
