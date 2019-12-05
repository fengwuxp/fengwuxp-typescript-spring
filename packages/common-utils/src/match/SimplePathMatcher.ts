import {PathMatcher} from "./PathMatcher";


const DEFAULT_PATH_SEPARATOR = '/';

/**
 * simple path matcher
 */
export default class SimplePathMatcher implements PathMatcher {
    // combine: (pattern1, pattern2) => string;
    // extractPathWithinPattern: (pattern: string, path: string) => string;
    // extractUriTemplateVariables: (pattern: string, path: string) => Map<String, String>;
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
        const endWithSeparator = pattern.endsWith(DEFAULT_PATH_SEPARATOR);

        const strings = pattern.split(DEFAULT_PATH_SEPARATOR)
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
                    return `${DEFAULT_PATH_SEPARATOR}${str}`;
                }
                return `${DEFAULT_PATH_SEPARATOR}${str}${DEFAULT_PATH_SEPARATOR}`;
            }).join("");
        regExpString = regExpString.replace(new RegExp(`${DEFAULT_PATH_SEPARATOR}${DEFAULT_PATH_SEPARATOR}`, 'g'), DEFAULT_PATH_SEPARATOR);
        if (!endWithWildcard) {
            regExpString = `${regExpString}$`;
        }
        const regExp = new RegExp(regExpString, fullMatch ? "gi" : "i");
        return regExp.test(path);
    }

}
