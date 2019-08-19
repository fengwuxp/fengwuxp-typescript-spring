import {EnvironmentCapable} from "../../../../spring-core/src/env/EnvironmentCapable";
import {ResourceLoaderAware} from "../ResourceLoaderAware";
import {Environment} from "../../../../spring-core/src/env/Environment";
import {ResourceLoader} from "../../../../spring-core/src/io/ResourceLoader";

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

 * @see ScannedGenericBeanDefinition
 * @see CandidateComponentsIndex
 */
export default class FilePathScanningCandidateComponentProvider implements EnvironmentCapable, ResourceLoaderAware {


    getEnvironment: () => Environment;


    setResourceLoader: (resourceLoader: ResourceLoader) => void;



}