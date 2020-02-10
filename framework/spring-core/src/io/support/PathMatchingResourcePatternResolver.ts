import {ResourcePatternResolver} from "./ResourcePatternResolver";
import AntPathMatcher from "fengwuxp-common-utils/lib/match/AntPathMatcher";
import {PathMatcher} from "fengwuxp-common-utils/lib/match/PathMatcher";
import {ResourceLoader} from "../ResourceLoader";
import FileSystemResourceLoader from "../FileSystemResourceLoader";
import * as path from "path";
import * as fs from "fs";
import {logger} from '../../debug/Log4jsHelper';


export default class PathMatchingResourcePatternResolver implements ResourcePatternResolver {

    private static TAG: string = "PathMatchingResourcePatternResolver";

    private _pathMatcher: PathMatcher = new AntPathMatcher(path.sep);

    private _resourceLoader: ResourceLoader;

    private basePath: string;

    constructor(basePath: string, resourceLoader: ResourceLoader = new FileSystemResourceLoader()) {
        this.basePath = path.normalize(basePath);
        this._resourceLoader = resourceLoader;
    }

    getResource = (location: string) => {
        return this._resourceLoader.getResource(location);
    };


    getResources = (locationPattern: string) => {


        const {pathMatcher, resourceLoader, basePath} = this;
        locationPattern = path.normalize(locationPattern);
        logger.debug(`${PathMatchingResourcePatternResolver.TAG} pattern match `, locationPattern);
        const isPattern = pathMatcher.isPattern(locationPattern);
        if (!isPattern) {
            return [];
        }
        const rootDir = path.normalize(path.join(basePath, this.determineRootDir(locationPattern)));
        logger.debug(`${PathMatchingResourcePatternResolver.TAG} root dir `, rootDir);
        if (!fs.existsSync(rootDir)) {
            return [];
        }
        let newPattern = basePath;
        let sep = path.sep;
        if (newPattern.endsWith(sep)) {
            if (locationPattern.startsWith(sep)) {
                newPattern = `${newPattern}${locationPattern.substr(1)}`
            } else {
                newPattern = `${newPattern}${locationPattern}`
            }
        } else {
            if (locationPattern.startsWith(sep)) {
                newPattern = `${newPattern}${locationPattern}`
            } else {
                newPattern = `${newPattern}${sep}${locationPattern}`
            }
        }

        const dirs = fs.readdirSync(rootDir);
        return dirs.map((fileName) => {
            return path.normalize(`${rootDir}${sep}${fileName}`);
        }).map(this.recursiveDir)
            .flatMap((items) => [...items])
            .filter(filepath => {
                return pathMatcher.match(newPattern, filepath);
            })
            .map(filepath => {
                return resourceLoader.getResource(filepath);
            });


    };

    private determineRootDir = (pattern: string) => {

        const separator = "**";
        if (pattern.indexOf(separator) < 0) {
            return pattern;
        }
        const [rootDir] = pattern.split(separator);
        return rootDir;

    };

    /**
     * 递归遍历目录
     * @param filepath
     */
    private recursiveDir = (filepath: string): string[] => {
        let sep = path.sep;
        const stats = fs.lstatSync(filepath);
        if (stats.isDirectory()) {
            const fileNames = fs.readdirSync(filepath);
            return fileNames.map((filename) => {
                const _filepath = path.normalize(`${filepath}${sep}${filename}`);
                return this.recursiveDir(_filepath);
            }).flatMap((items) => [...items]);
        } else {
            return [path.normalize(filepath)];
        }
    };

    get pathMatcher(): PathMatcher {
        return this._pathMatcher;
    }

    set pathMatcher(value: PathMatcher) {
        this._pathMatcher = value;
    }

    get resourceLoader(): ResourceLoader {
        return this._resourceLoader;
    }

    set resourceLoader(value: ResourceLoader) {
        this._resourceLoader = value;
    }
}
