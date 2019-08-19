import {Resource} from "./Resource";

/**
 * Strategy interface for loading resources (e.. class path or file system
 * resources). An {@link org.springframework.context.ApplicationContext}
 * is required to provide this functionality, plus extended
 * {@link org.springframework.core.io.support.ResourcePatternResolver} support.
 *
 * <p>{@link DefaultResourceLoader} is a standalone implementation that is
 * usable outside an ApplicationContext, also used by {@link ResourceEditor}.
 *
 * <p>Bean properties of type Resource and Resource array can be populated
 * from Strings when running in an ApplicationContext, using the particular
 * context's resource loading strategy.
 */
export interface ResourceLoader {


    /**
     * Return a Resource handle for the specified resource location.
     * <p>Note that a Resource handle does not imply an existing resource;
     * you need to invoke {@link Resource#exists} to check for existence.
     * @param location the resource location
     * @return a corresponding Resource handle (never {@code null})
     * @see Resource#exists()
     * @see Resource#getInputStream()
     */
    getResource: (location: string) => Resource;
}