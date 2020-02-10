import {MetadataType, TypeFilter} from "./TypeFilter";
import {PathMatcher} from "fengwuxp-common-utils/lib/match/PathMatcher";
import AntPathMatcher from "fengwuxp-common-utils/lib/match/AntPathMatcher";
import path from "path";


export class PathMatchFilter implements TypeFilter {

    private pattern: string | string[];

    private pathMatcher: PathMatcher = new AntPathMatcher(path.sep);

    constructor(pattern: string | string[]) {
        if (Array.isArray(pattern)) {
            pattern = pattern.map(path.normalize);
        } else {
            pattern = path.normalize(pattern);
        }
        this.pattern = pattern;
    }

    match = (metadata: MetadataType,) => {
        const {pathMatcher, pattern} = this;
        const filepath = path.normalize(metadata.filepath);
        if (Array.isArray(pattern)) {
            return pattern.map(p => {
                return pathMatcher.match(p, filepath);
            }).reduce((previousValue, currentValue) => {
                return previousValue || currentValue
            }, false);
        }
        return pathMatcher.match(pattern, filepath);
    };


}
