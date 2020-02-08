import {ResourceLoader} from "../ResourceLoader";
import {Resource} from "../Resource";


/**
 * Strategy interface for resolving a location pattern (for example,
 * an Ant-style path pattern) into Resource objects.
 *
 * <p>This is an extension to the {@link org.springframework.core.io.ResourceLoader}
 * interface. A passed-in ResourceLoader (for example, an
 * {@link org.springframework.context.ApplicationContext} passed in via
 * {@link org.springframework.context.ResourceLoaderAware} when running in a context)
 * can be checked whether it implements this extended interface too.
 *
 * <p>{@link PathMatchingResourcePatternResolver} is a standalone implementation
 * that is usable outside an ApplicationContext, also used by
 * {@link ResourceArrayPropertyEditor} for populating Resource array bean properties.
 *
 * <p>Can be used with any sort of location pattern (e.g. "/WEB-INF/*-context.xml"):
 * Input patterns have to match the strategy implementation. This interface just
 * specifies the conversion method rather than a specific pattern format.
 *
 * <p>This interface also suggests a new resource prefix "classpath*:" for all
 * matching resources from the class path. Note that the resource location is
 * expected to be a path without placeholders in this case (e.g. "/beans.xml");
 * JAR files or classes directories can contain multiple files of the same name.
 *
 */
export interface ResourcePatternResolver extends ResourceLoader {


    /**
     * Resolve the given location pattern into Resource objects.
     * <p>Overlapping resource entries that point to the same physical
     * resource should be avoided, as far as possible. The result should
     * have set semantics.
     * @param locationPattern the location pattern to resolve
     * @return the corresponding Resource objects
     * @throws IOException in case of I/O errors
     */
    getResources: (locationPattern: string) => Resource[];
}
