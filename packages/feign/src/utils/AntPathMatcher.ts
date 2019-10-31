import {PathMatcher} from "./PathMatcher";
import XRegExp from "xregexp";
import * as quotemeta from "xregexp-quotemeta";
quotemeta.addSupportTo(XRegExp);

const DEFAULT_PATH_SEPARATOR = '/';
const CACHE_TURNOFF_THRESHOLD = 65536;
const GLOB_PATTERN: RegExp = /\?|\*|\{((?:\{[^/]+?\}|[^/{}]|\\[{}])+?)\}/g;
const WILDCARD_CHARS: string[] = ['*', '?', '{'];
const DEFAULT_VARIABLE_PATTERN: string = "(.*)";


/**
 * @see https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/main/java/org/springframework/util/AntPathMatcher.java
 */
export default class AntPathMatcher implements PathMatcher {

    private caseSensitive: boolean = true;

    private trimTokens: boolean = false;

    private cachePatterns: boolean;

    private pathSeparator: string;

    private tokenizedPatternCache: Map<string, string[]> = new Map<string, string[]>();

    private stringMatcherCache: Map<string, AntPathStringMatcher> = new Map<string, AntPathStringMatcher>();

    constructor(pathSeparator: string = DEFAULT_PATH_SEPARATOR) {
        this.pathSeparator = pathSeparator;
    }


    combine: (pattern1, pattern2) => string;

    extractPathWithinPattern: (pattern: string, path: string) => string;

    extractUriTemplateVariables: (pattern: string, path: string) => Map<string, string>;

    isPattern = (path: string) => {
        return (path.indexOf('*') != -1 || path.indexOf('?') != -1);
    };
    match = (pattern: string, path: string): boolean => {
        return this.doMatch(pattern, path, true, null);
    };
    matchStart = (pattern: string, path: string): boolean => {
        return this.doMatch(pattern, path, false, null);
    };

    /**
     * Actually match the given {@code path} against the given {@code pattern}.
     * @param pattern the pattern to match against
     * @param path the path String to test
     * @param fullMatch whether a full pattern match is required (else a pattern match
     * as far as the given base path goes is sufficient)
     * @param uriTemplateVariables
     * @return {@code true} if the supplied {@code path} matched, {@code false} if it didn't
     */
    protected doMatch = (pattern: string, path: string, fullMatch: boolean, uriTemplateVariables: Map<string, string>): boolean => {
        const {pathSeparator, caseSensitive} = this;

        if (path.startsWith(pathSeparator) != pattern.startsWith(pathSeparator)) {
            return false;
        }

        const pattDirs: string[] = this.tokenizePattern(pattern);
        if (fullMatch && caseSensitive && !this.isPotentialMatch(path, pattDirs)) {
            return false;
        }

        const pathDirs: string[] = this.tokenizePath(path);

        let pattIdxStart = 0;
        let pattIdxEnd = pattDirs.length - 1;
        let pathIdxStart = 0;
        let pathIdxEnd = pathDirs.length - 1;

        // Match all elements up to the first **
        while (pattIdxStart <= pattIdxEnd && pathIdxStart <= pathIdxEnd) {
            let pattDir: string = pattDirs[pattIdxStart];
            if ("**" === pattDir) {
                break;
            }
            if (!this.matchStrings(pattDir, pathDirs[pathIdxStart], uriTemplateVariables)) {
                return false;
            }
            pattIdxStart++;
            pathIdxStart++;
        }

        if (pathIdxStart > pathIdxEnd) {
            // Path is exhausted, only match if rest of pattern is * or **'s
            if (pattIdxStart > pattIdxEnd) {
                return (pattern.endsWith(pathSeparator) == path.endsWith(pathSeparator));
            }
            if (!fullMatch) {
                return true;
            }
            if (pattIdxStart == pattIdxEnd && pattDirs[pattIdxStart] === "*" && path.endsWith(pathSeparator)) {
                return true;
            }
            for (let i = pattIdxStart; i <= pattIdxEnd; i++) {
                if (pattDirs[i] !== "**") {
                    return false;
                }
            }
            return true;
        } else if (pattIdxStart > pattIdxEnd) {
            // String not exhausted, but pattern is. Failure.
            return false;
        } else if (!fullMatch && "**" === (pattDirs[pattIdxStart])) {
            // Path start definitely matches due to "**" part in pattern.
            return true;
        }

        // up to last '**'
        while (pattIdxStart <= pattIdxEnd && pathIdxStart <= pathIdxEnd) {
            let pattDir = pattDirs[pattIdxEnd];
            if (pattDir === "**") {
                break;
            }
            if (!this.matchStrings(pattDir, pathDirs[pathIdxEnd], uriTemplateVariables)) {
                return false;
            }
            pattIdxEnd--;
            pathIdxEnd--;
        }
        if (pathIdxStart > pathIdxEnd) {
            // String is exhausted
            for (let i = pattIdxStart; i <= pattIdxEnd; i++) {
                if (pattDirs[i] !== "**") {
                    return false;
                }
            }
            return true;
        }

        while (pattIdxStart != pattIdxEnd && pathIdxStart <= pathIdxEnd) {
            let patIdxTmp: number = -1;
            for (let i = pattIdxStart + 1; i <= pattIdxEnd; i++) {
                if (pattDirs[i] === "**") {
                    patIdxTmp = i;
                    break;
                }
            }
            if (patIdxTmp == pattIdxStart + 1) {
                // '**/**' situation, so skip one
                pattIdxStart++;
                continue;
            }
            // Find the pattern between padIdxStart & padIdxTmp in str between
            // strIdxStart & strIdxEnd
            let patLength = (patIdxTmp - pattIdxStart - 1);
            let strLength = (pathIdxEnd - pathIdxStart + 1);
            let foundIdx = -1;

            strLoop:
                for (let i = 0; i <= strLength - patLength; i++) {
                    for (let j = 0; j < patLength; j++) {
                        let subPat = pattDirs[pattIdxStart + j + 1];
                        let subStr = pathDirs[pathIdxStart + i + j];
                        if (!this.matchStrings(subPat, subStr, uriTemplateVariables)) {
                            continue strLoop;
                        }
                    }
                    foundIdx = pathIdxStart + i;
                    break;
                }

            if (foundIdx == -1) {
                return false;
            }

            pattIdxStart = patIdxTmp;
            pathIdxStart = foundIdx + patLength;
        }

        for (let i = pattIdxStart; i <= pattIdxEnd; i++) {
            if (pattDirs[i] !== "**") {
                return false;
            }
        }

        return true;
    };

    /**
     * Test whether or not a string matches against a pattern.
     * @param pattern the pattern to match against (never {@code null})
     * @param str the String which must be matched against the pattern (never {@code null})
     * @uriTemplateVariables
     * @return {@code true} if the string matches against the pattern, or {@code false} otherwise
     */
    private matchStrings = (pattern: string, str: string, uriTemplateVariables: Map<string, string>) => {
        return this.getStringMatcher(pattern).matchStrings(str, uriTemplateVariables);
    };

    /**
     * Build or retrieve an {@link AntPathStringMatcher} for the given pattern.
     * <p>The default implementation checks this AntPathMatcher's internal cache
     * (see {@link #setCachePatterns}), creating a new AntPathStringMatcher instance
     * if no cached copy is found.
     * <p>When encountering too many patterns to cache at runtime (the threshold is 65536),
     * it turns the default cache off, assuming that arbitrary permutations of patterns
     * are coming in, with little chance for encountering a recurring pattern.
     * <p>This method may be overridden to implement a custom cache strategy.
     * @param pattern the pattern to match against (never {@code null})
     * @return a corresponding AntPathStringMatcher (never {@code null})
     * @see #setCachePatterns
     */
    protected getStringMatcher = (pattern: string): AntPathStringMatcher => {
        let matcher = null;
        let {cachePatterns, caseSensitive} = this;
        if (cachePatterns == null || cachePatterns) {
            matcher = this.stringMatcherCache.get(pattern);
        }
        if (matcher == null) {
            matcher = new AntPathStringMatcher(pattern, caseSensitive);
            if (cachePatterns == null && this.stringMatcherCache.size >= CACHE_TURNOFF_THRESHOLD) {
                // Try to adapt to the runtime situation that we're encountering:
                // There are obviously too many different patterns coming in here...
                // So let's turn off the cache since the patterns are unlikely to be reoccurring.
                this.deactivatePatternCache();
                return matcher;
            }
            if (cachePatterns == null || cachePatterns) {
                this.stringMatcherCache.set(pattern, matcher);
            }
        }
        return matcher;
    };

    private deactivatePatternCache = () => {
        this.cachePatterns = false;
        this.tokenizedPatternCache.clear();
        this.stringMatcherCache.clear();
    };

    private isPotentialMatch = (path: string, pattDirs: string[]): boolean => {
        if (!this.trimTokens) {
            let pos = 0;
            pattDirs.forEach((pattDir) => {
                let skipped = this.skipSeparator(path, pos, this.pathSeparator);
                pos += skipped;
                skipped = this.skipSegment(path, pos, pattDir);
                if (skipped < pattDir.length) {
                    return (skipped > 0 || (pattDir.length > 0 && this.isWildcardChar(pattDir.charAt(0))));
                }
                pos += skipped;
            })

        }
        return true;

    };

    private skipSegment = (path: string, pos: number, prefix: string): number => {
        let skipped = 0;
        for (let i = 0; i < prefix.length; i++) {
            let c = prefix.charAt(i);
            if (this.isWildcardChar(c)) {
                return skipped;
            }
            let currPos = pos + skipped;
            if (currPos >= path.length) {
                return 0;
            }
            if (c == path.charAt(currPos)) {
                skipped++;
            }
        }
        return skipped;
    };

    private skipSeparator = (path: string, pos: number, separator: string) => {
        let skipped = 0;
        while (path.startsWith(separator, pos + skipped)) {
            skipped += separator.length;
        }
        return skipped;
    };

    private isWildcardChar = (c: string): boolean => {

        return WILDCARD_CHARS.some(candidate => c === candidate);
    };


    private tokenizePath = (path: string) => {
        return path.split(DEFAULT_PATH_SEPARATOR).filter(x => x).map(x => x.trim());
    };

    private tokenizePattern = (pattern: string) => {
        return this.tokenizePath(pattern);
    };
}


class AntPathStringMatcher {

    private variableNames: string[] = [];

    private pattern: XRegExp;

    constructor(pattern: string, caseSensitive: boolean = true) {
        const patternBuilder: string[] = [];
        let matcher;
        let end = 0;
        while ((matcher = GLOB_PATTERN.exec(pattern)) != null) {
            patternBuilder.push(this.quote(pattern, end, matcher.index));
            let match = matcher[0];
            if ("?" == match) {
                patternBuilder.push('.');
            } else if ("*" == match) {
                patternBuilder.push(".*");
            } else if (match.startsWith("{") && match.endsWith("}")) {
                let colonIdx = match.indexOf(':');
                if (colonIdx == -1) {
                    patternBuilder.push(DEFAULT_VARIABLE_PATTERN);
                    this.variableNames.push(matcher[1]);
                } else {
                    let variablePattern = match.substring(colonIdx + 1, match.length - 1);
                    patternBuilder.push('(');
                    patternBuilder.push(variablePattern);
                    patternBuilder.push(')');
                    let variableName = match.substring(1, colonIdx);
                    this.variableNames.push(variableName);
                }
            }

            end = GLOB_PATTERN.lastIndex;
        }
        patternBuilder.push(this.quote(pattern, end, pattern.length));
        const regExpSource = patternBuilder.filter(item => item.trim().length > 0).join("");
        // this.pattern = new RegExp(regExpSource, caseSensitive ? 'g' : 'gi');
        this.pattern = new XRegExp(regExpSource, caseSensitive ? 'g' : 'ig');
    }

    public matchStrings = (str: string, uriTemplateVariables: Map<String, String>) => {

        const {pattern} = this;
        let matcher, matchResult = [];
        const xRegExp = new XRegExp(`^${this.pattern.source}$`, 'g');
        while ((matcher = xRegExp.exec(str)) != null && matcher[0]) {
            matchResult.push(matcher[0])
        }
        const length = matchResult.length;
        if (length > 0) {
            if (uriTemplateVariables != null) {
                if (this.variableNames.length != length) {
                    throw new Error("The number of capturing groups in the pattern segment " +
                        pattern + " does not match the number of URI template letiables it defines, " +
                        "which can occur if capturing groups are used in a URI template regex. " +
                        "Use non-capturing groups instead.");
                }
                for (let i = 1; i <= length; i++) {
                    let name = this.variableNames[i - 1];
                    let value = matchResult[i];
                    uriTemplateVariables.set(name, value);
                }
            }
            return true;
        }
        return false;


    };

    private quote = (str: string, start: number, end: number) => {
        if (start == end)
            return '';
        return this.patternQuote(str.substring(start, end));
    };

    private patternQuote = (s) => {
        let slashEIndex = s.indexOf("\\E");
        if (slashEIndex == -1) {
            return `\\Q${s}\\E`;
        }
        let sb = [];

        sb.push("\\Q");
        slashEIndex = 0;
        let current = 0;
        while ((slashEIndex = s.indexOf("\\E", current)) != -1) {
            sb.push(s.substring(current, slashEIndex));
            current = slashEIndex + 2;
            sb.push("\\E\\\\E\\Q");
        }
        sb.push(s.substring(current, s.length));
        sb.push("\\E");
        return sb.join("");
    }


}



