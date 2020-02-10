import {PathMatcher} from "./PathMatcher";


const DEFAULT_PATH_SEPARATOR = '/';

/**
 * simple path matcher
 */
export default class SimplePathMatcher implements PathMatcher {
    // combine: (pattern1, pattern2) => string;
    // extractPathWithinPattern: (pattern: string, path: string) => string;
    // extractUriTemplateVariables: (pattern: string, path: string) => Map<String, String>;

    private pathSeparator: string;


    constructor(pathSeparator: string = DEFAULT_PATH_SEPARATOR) {
        this.pathSeparator = pathSeparator;
    }

    isPattern = (path: string) => {
        return (path.indexOf('*') != -1 || path.indexOf('?') != -1);
    };
    match = (pattern: string, path: string): boolean => {
        return this.doMatch(pattern, path, true);
    };
    matchStart = (pattern: string, path: string): boolean => {
        return this.doMatch(pattern, path, false);
    };


    private doMatch = (pattern: string, path: string, fullMatch: boolean) => {

        if (pattern.startsWith("**")) {
            pattern = `**${pattern}`;
        }
        const endWithWildcard = pattern.endsWith("**");
        const pathSeparator = this.pathSeparator;
        const endWithSeparator = pattern.endsWith(pathSeparator);

        const strings = pattern.split(pathSeparator)
            .filter((str) => {
                return str.trim().length > 0;
            });
        let regExpString = strings
            .map((str, index) => {
                if (str === "**") {
                    // 匹配任意字符
                    return "(.*?)";
                }
                if (!endWithSeparator && index === strings.length - 1) {
                    return `${pathSeparator}${str}`;
                }
                return `${pathSeparator}${str}${pathSeparator}`;
            }).join("");
        regExpString = regExpString.replace(new RegExp(`${pathSeparator}${pathSeparator}`, 'g'), pathSeparator);
        if (!endWithWildcard) {
            regExpString = `${regExpString}$`;
        }
        const regExp = new RegExp(regExpString, fullMatch ? "gi" : "i");
        return regExp.test(path);
    }

}
