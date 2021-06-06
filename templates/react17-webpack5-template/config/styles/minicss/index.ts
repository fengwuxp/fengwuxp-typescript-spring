import MiniCssExtractPlugin from "mini-css-extract-plugin";


export const miniCssExtractLoader = () => {
    return {
        loader: MiniCssExtractPlugin.loader,
        ident: "css-loader"
    };
}
