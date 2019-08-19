/**
 * Interface for resolving properties against any underlying source.
 */
export interface PropertyResolver {

    /**
     * Return whether the given property key is available for resolution,
     * i.e. if the value for the given key is not {@code null}.
     */
    containsProperty: (key: string) => boolean;

    /**
     * Return the property value associated with the given key,
     * or {@code null} if the key cannot be resolved.
     * @param key the property name to resolve
     * @param defaultValue the default value to return if no value is found
     * @see #getRequiredProperty(String)
     */
    getProperty: <T = string>(key: string, defaultValue?: T) => T;

    /**
     * Return the property value associated with the given key, converted to the given
     * targetType (never {@code null}).
     * @param key
     * @param defaultValue
     */
    getRequiredProperty: <T = string>(key: string, defaultValue?: T) => T;


    /**
     * Resolve ${...} placeholders in the given text, replacing them with corresponding
     * property values as resolved by {@link #getProperty}. Unresolvable placeholders with
     * no default value are ignored and passed through unchanged.
     * @param text the String to resolve
     * @return the resolved String (never {@code null})
     * @see #resolveRequiredPlaceholders
     */
    resolvePlaceholders: (text: string) => string;

    /**
     * Resolve ${...} placeholders in the given text, replacing them with corresponding
     * property values as resolved by {@link #getProperty}. Unresolvable placeholders with
     * @return the resolved String (never {@code null})
     * @throws IllegalArgumentException if given text is {@code null}
     * or if any placeholders are unresolvable
     */
    resolveRequiredPlaceholders: (text: string) => string;

}