const path = require("path");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const {getWebpackLibraryTargetConfig} = require("fengwuxp-spring-webpack-4/lib/library/webpack.library.conf");


const config = getWebpackLibraryTargetConfig({
    entry: {
        index: path.resolve('./src', 'index.ts'),
    },
    production: process.env.production || false,
    plugins: [
        //复制
        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(__dirname, "./index.d.ts"),
        //         to: path.resolve(__dirname, "./lib/index.d.ts"),
        //     }
        // ])
    ]
});

module.exports = config;
