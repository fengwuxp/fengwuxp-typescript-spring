/**
 * Input provided to an expression parser that can influence an expression
 * parsing/compilation routine.
 */
export interface ParserContext {
    /**
     * Whether or not the expression being parsed is a template. A template expression
     * consists of literal text that can be mixed with evaluatable blocks. Some examples:
     * <pre class="code">
     *       Some literal text
     *     Hello #{name.firstName}!
     *     #{3 + 4}
     * </pre>
     * @return true if the expression is a template, false otherwise
     */
    isTemplate: () => boolean;

    getRegExp: () => RegExp;

    /**
     * For template expressions, returns the prefix that identifies the start of an
     * expression block within a string. For example: "${"
     * @return the prefix that identifies the start of an expression
     */
    getExpressionPrefix: () => string;

    /**
     * For template expressions, return the prefix that identifies the end of an
     * expression block within a string. For example: "}"
     * @return the suffix that identifies the end of an expression
     */
    getExpressionSuffix: () => string;
}

/**
 * The default ParserContext implementation that enables template expression
 * parsing mode. The expression prefix is "#{" and the expression suffix is "}".
 * @see #isTemplate()
 */
export const TEMPLATE_EXPRESSION: ParserContext = {

    isTemplate: () => {
        return true;
    },

    getRegExp: () => {
        return /\$\{([^\}]*)\}/g;
    },

    getExpressionPrefix: () => {
        return "${";
    },

    getExpressionSuffix: () => {
        return "}";
    }

};
