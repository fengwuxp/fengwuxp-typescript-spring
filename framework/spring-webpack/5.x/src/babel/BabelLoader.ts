import {isExclude} from "../hepler/WebpackLoaderHelper";
import {getBabel7Configuration} from "./GetBabelConfiguration";



/**
 * babel-loader
 * @author wxup
 * @create 2018-09-25 9:37
 **/

export const babel7Loader = {
    test: /\.js[x]?$/,
    exclude: isExclude,
    use: [
        {
            loader: "babel-loader",
            options: getBabel7Configuration()
        }
    ]
};

