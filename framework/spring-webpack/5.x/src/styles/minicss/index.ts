import MiniCssExtractPlugin from "mini-css-extract-plugin";


export const miniCssExtractLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        hmr: process.env.NODE_ENV === 'development',
    },
};
