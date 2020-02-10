import {parse} from "@babel/parser";
import {MetadataType, TypeFilter} from "fengwuxp-spring-core/esnext/core/type/TypeFilter";
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


    private includeFilters: TypeFilter[] = [];

    private excludeFilters: TypeFilter[] = [];

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
    findCandidateComponents = (locationPattern: string): Set<MetadataType> => {

        const resourcePatternResolver = this.getResourcePatternResolver();
        const resources = resourcePatternResolver.getResources(locationPattern);
        const {excludeFilters, includeFilters} = this;
        const files = resources.filter((resource) => {
            if (excludeFilters.length == 0) {
                // 默认不排除
                return true;
            }
            const filepath = fileURLToPath(resource.getURL());
            return !excludeFilters.map((filter) => {
                return filter.match({
                    filepath: filepath,
                    file: null
                });
            }).reduce((previousValue, currentValue) => {
                return previousValue || currentValue
            }, false);
        }).map(resource => {
            const filepath = fileURLToPath(resource.getURL());
            return [filepath, fs.readFileSync(filepath, "UTF-8")]
        }).map(([filepath, sourceCodeText]) => {
            return {
                filepath,
                file: parse(sourceCodeText, {
                    sourceType: "module",
                    plugins: [
                        "typescript",
                        "jsx",
                        "classProperties",
                        "decorators-legacy"
                    ]
                })
            }
        }).filter((metadata) => {
            if (includeFilters.length == 0) {
                // 默认包含
                return true;
            }
            return includeFilters.map((filter) => {
                return filter.match(metadata);
            }).reduce((previousValue, currentValue) => {
                return previousValue || currentValue
            }, false);
        }).filter(this.isCandidateComponent);

        return new Set<MetadataType>(files);
    };


    /**
     * Add an include type filter to the <i>end</i> of the inclusion list.
     */
    public addIncludeFilter = (includeFilter: TypeFilter) => {
        this.includeFilters.push(includeFilter);
    };


    /**
     * Add an exclude type filter to the <i>front</i> of the exclusion list.
     */
    public addExcludeFilter = (excludeFilter: TypeFilter) => {
        this.excludeFilters.push(excludeFilter);
    };

    /**
     * Determine whether the given bean definition qualifies as candidate.
     * <p>The default implementation checks whether the class is not an interface
     * and not dependent on an enclosing class.
     * <p>Can be overridden in subclasses.
     * @param metadataType the bean definition to check
     * @return whether the bean definition qualifies as a candidate component
     */
    protected isCandidateComponent = (metadataType: MetadataType) => {
        return metadataType != null;
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
