import {parse} from "@babel/parser";
import {File} from "@babel/types";
import {TypeFilter} from "fengwuxp-spring-core/esnext/core/type/TypeFilter";
import {ResourcePatternResolver} from "fengwuxp-spring-core/esnext/io/support/ResourcePatternResolver";
import PathMatchingResourcePatternResolver
    from "fengwuxp-spring-core/esnext/io/support/PathMatchingResourcePatternResolver";
import * as fs from "fs";
import {fileURLToPath} from "url";

/**
 * A component provider that provides candidate components from a base package. Can
 * use {@link CandidateComponentsIndex the index} if it is available of scans the
 * classpath otherwise. Candidate components are identified by applying exclude and
 * include filters. {@link AnnotationTypeFilter}, {@link AssignableTypeFilter} include
 * filters on an annotation/superclass that are annotated with {@link Indexed} are
 * supported: if any other include filter is specified, the index is ignored and
 * classpath scanning is used instead.
 *
 * <p>This implementation is based on Spring's
 * {@link org.springframework.core.type.classreading.MetadataReader MetadataReader}
 * facility, backed by an ASM {@link org.springframework.asm.ClassReader ClassReader}.
 */
export default class FilePathScanningCandidateProgramProvider /*implements EnvironmentCapable, ResourceLoaderAware*/ {


    private includeFilters: TypeFilter<any>[] = [];

    private excludeFilters: TypeFilter<any>[] = [];

    private _resourcePatternResolver: ResourcePatternResolver;

    private projectBasePath: string;


    constructor(projectBasePath: string = fs.realpathSync(process.cwd())) {
        this.projectBasePath = projectBasePath;
    }

    /**
     * Scan the class path for candidate components.
     * @param locationPattern the package to check for annotated classes
     * @return a corresponding Set of autodetected bean definitions
     */
    findCandidateComponents = (locationPattern: string): Set<{ filepath: string, file: File }> => {

        const resourcePatternResolver = this.getResourcePatternResolver();
        const resources = resourcePatternResolver.getResources(locationPattern);
        const files = resources.map(resource => {
            const filepath = fileURLToPath(resource.getURL());
            return [filepath, fs.readFileSync(filepath, "UTF-8")]
        }).map(([filepath, sourceCodeText]) => {
            return {
                filepath,
                file: parse(sourceCodeText, {
                    sourceType: "module",
                    plugins: [
                        "typescript",
                        "classProperties",
                        "decorators-legacy"
                    ]
                })
            }
        });

        return new Set<{ filepath: string, file: File }>(files);
    };


    /**
     * Add an include type filter to the <i>end</i> of the inclusion list.
     */
    public addIncludeFilter = (includeFilter: TypeFilter<any>) => {
        this.includeFilters.push(includeFilter);
    };


    /**
     * Add an exclude type filter to the <i>front</i> of the exclusion list.
     */
    public addExcludeFilter = (excludeFilter: TypeFilter<any>) => {
        this.excludeFilters.push(excludeFilter);
    };

    private getResourcePatternResolver = (): ResourcePatternResolver => {
        if (this._resourcePatternResolver == null) {
            this._resourcePatternResolver = new PathMatchingResourcePatternResolver(this.projectBasePath);
        }
        return this._resourcePatternResolver;
    };

    set resourcePatternResolver(value: ResourcePatternResolver) {
        this._resourcePatternResolver = value;
    }
}
