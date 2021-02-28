import {RouteMethodResolver} from "./RouteMethodResolver";
import StringUtils from "fengwuxp_common_utils/src/string/StringUtils";


const URI_SYMBOL_SLASH = "/";
const URI_SYMBOL_COLON = ":";

//替换冒号的符号
const REPLACE_COLON_SYMBOL = "$";

/**
 * 默认的路由方法解析者
 */
export default class DefaultRouteMethodResolver implements RouteMethodResolver {


    methodNameToUri = (methodName: string) => {
        if (!StringUtils.hasText(methodName)) {
            return null;
        }

        //加上第一个斜杆
        return URI_SYMBOL_SLASH + methodName.replace(/[A-Z]+/g, (s) => {

            return `${URI_SYMBOL_SLASH}${s.toUpperCase()}`
        }).replace(REPLACE_COLON_SYMBOL, URI_SYMBOL_COLON);
    };

    uriToMethodName = (uri: string) => {
        if (!StringUtils.hasText(uri)) {
            return null;
        }

        const chars = uri.split("");

        return chars.map((item, index) => {
            switch (item) {
                case URI_SYMBOL_SLASH:
                    if (index == 0) {
                        //忽略第一个斜杆
                        return "";
                    }
                    //斜杠转驼峰
                    const nextChart = chars[index + 1].toUpperCase();
                    chars[index + 1] = nextChart;
                    return "";
                case URI_SYMBOL_COLON:
                    return REPLACE_COLON_SYMBOL;
            }
            return item;
        }).join("");


    };


}