/**
 * @see https://github.com/spring-projects/spring-framework/blob/master/spring-core/src/main/java/org/springframework/util/PathMatcher.java
 */
export interface PathMatcher {

    /**
     * Does the given {@code path} represent a pattern that can be matched
     * by an implementation of this interface?
     * <p>If the return value is {@code false}, then the {@link #match}
     * method does not have to be used because direct equality comparisons
     * on the static path Strings will lead to the same result.
     * @param path the path String to check
     * @return {@code true} if the given {@code path} represents a pattern
     */
    isPattern: (path: string) => boolean;

    /**
     * Match the given {@code path} against the given {@code pattern},
     * according to this PathMatcher's matching strategy.
     * @param pattern the pattern to match against
     * @param path the path String to test
     * @return {@code true} if the supplied {@code path} matched,
     * {@code false} if it didn't
     */
    match: (pattern: string, path: string) => boolean;

    /**
     * Match the given {@code path} against the corresponding part of the given
     * {@code pattern}, according to this PathMatcher's matching strategy.
     * <p>Determines whether the pattern at least matches as far as the given base
     * path goes, assuming that a full path may then match as well.
     * @param pattern the pattern to match against
     * @param path the path String to test
     * @return {@code true} if the supplied {@code path} matched,
     * {@code false} if it didn't
     */
    matchStart: (pattern: string, path: string) => boolean;

    /**
     * Given a pattern and a full path, determine the pattern-mapped part.
     * <p>This method is supposed to find out which part of the path is matched
     * dynamically through an actual pattern, that is, it strips off a statically
     * defined leading path from the given full path, returning only the actually
     * pattern-matched part of the path.
     * <p>For example: For "myroot/*.html" as pattern and "myroot/myfile.html"
     * as full path, this method should return "myfile.html". The detailed
     * determination rules are specified to this PathMatcher's matching strategy.
     * <p>A simple implementation may return the given full path as-is in case
     * of an actual pattern, and the empty String in case of the pattern not
     * containing any dynamic parts (i.e. the {@code pattern} parameter being
     * a static path that wouldn't qualify as an actual {@link #isPattern pattern}).
     * A sophisticated implementation will differentiate between the static parts
     * and the dynamic parts of the given path pattern.
     * @param pattern the path pattern
     * @param path the full path to introspect
     * @return the pattern-mapped part of the given {@code path}
     * (never {@code null})
     */
    extractPathWithinPattern: (pattern: string, path: string) => string;

    /**
     * Given a pattern and a full path, extract the URI template letiables. URI template
     * letiables are expressed through curly brackets ('{' and '}').
     * <p>For example: For pattern "/hotels/{hotel}" and path "/hotels/1", this method will
     * return a map containing "hotel"->"1".
     * @param pattern the path pattern, possibly containing URI templates
     * @param path the full path to extract template letiables from
     * @return a map, containing letiable names as keys; letiables values as values
     */
    extractUriTemplateVariables: (pattern: string, path: string) => Map<String, String>;


    /**
     * Combines two patterns into a new pattern that is returned.
     * <p>The full algorithm used for combining the two pattern depends on the underlying implementation.
     * @param pattern1 the first pattern
     * @param pattern2 the second pattern
     * @return the combination of the two patterns
     * @throws IllegalArgumentException when the two patterns cannot be combined
     */
    combine: (pattern1, pattern2) => string;
}
