import {MetadataType, TypeFilter} from "./TypeFilter";
import {PathMatcher} from "fengwuxp-common-utils/lib/match/PathMatcher";
import AntPathMatcher from "fengwuxp-common-utils/lib/match/AntPathMatcher";


export class PathMatchFilter implements TypeFilter {

    private pattern: string | string[];

    private pathMatcher: PathMatcher = new AntPathMatcher();

    constructor(pattern: string | string[]) {
        this.pattern = pattern;
    }

    match = (metadata: MetadataType,) => {
        const {pathMatcher, pattern} = this;
        if (Array.isArray(pattern)) {
            return pattern.map(p => {
                return pathMatcher.match(p, metadata.filepath);
            }).reduce((previousValue, currentValue) => {
                return previousValue && currentValue
            },false);
        }
        return pathMatcher.match(pattern, metadata.filepath);
    };


}
