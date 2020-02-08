import {URL} from "url";

/**
 * Interface for a resource descriptor that abstracts from the actual
 * type of underlying resource, such as a file or class path resource.
 */

export interface Resource {

    /**
     * Determine whether this resource actually exists in physical form.
     * <p>This method performs a definitive existence check, whereas the
     * existence of a {@code Resource} handle only guarantees a valid
     * descriptor handle.
     */
    exists: () => boolean;

    /**
     * Indicate whether non-empty contents of this resource can be read via
     * {@link #getInputStream()}.
     * <p>Will be {@code true} for typical resource descriptors that exist
     * since it strictly implies {@link #exists()} semantics as of 5.1.
     * Note that actual content reading may still fail when attempted.
     * However, a value of {@code false} is a definitive indication
     * that the resource content cannot be read.
     * @see #getInputStream()
     * @see #exists()
     */
    isReadable: () => boolean

    /**
     * Indicate whether this resource represents a handle with an open stream.
     * If {@code true}, the InputStream cannot be read multiple times,
     * and must be read and closed to avoid resource leaks.
     * <p>Will be {@code false} for typical resource descriptors.
     */
    isOpen: () => boolean;


    /**
     * Return a URL handle for this resource.
     * @throws IOException if the resource cannot be resolved as URL,
     * i.e. if the resource is not available as descriptor
     */
    getURL: () => URL;

    /**
     * Determine whether this resource represents a file in a file system.
     * A value of {@code true} strongly suggests (but does not guarantee)
     * that a {@link #getFile()} call will succeed.
     * <p>This is conservatively {@code false} by default.
     * @since 5.0
     * @see #getFile()
     */
    isFile: () => boolean;
    /**
     * Determine a filename for this resource, i.e. typically the last
     * part of the path: for example, "myfile.txt".
     * <p>Returns {@code null} if this type of resource does not
     * have a filename.
     */
    getFilename: () => string;

    /**
     * Return a description for this resource,
     * to be used for error output when working with the resource.
     * <p>Implementations are also encouraged to return this value
     * from their {@code toString} method.
     * @see Object#toString()
     */
    getDescription: () => string;
}
