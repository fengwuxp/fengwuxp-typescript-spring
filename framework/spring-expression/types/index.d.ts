/**
 * Expressions are executed in an evaluation context. It is in this context that
 * references are resolved when encountered during expression evaluation.
 */
declare type EvaluationContext = Record<string, any> | Array<any> | Map<string | number, any> | Set<any>;

/**
 * An expression capable of evaluating itself against context objects.
 * Encapsulates the details of a previously parsed expression string.
 * Provides a common abstraction for expression evaluation.
 */
interface Expression {
    /**
     * Return the original string used to create this expression (unmodified).
     * @return the original expression string
     */
    getExpressionString: () => string;
    /**
     * Evaluate this expression in the default standard context.
     * @param context the context in which to evaluate the expression
     * @param rootObject the root object against which to evaluate the expression
     * @return the evaluation result
     * @throws EvaluationException if there is a problem during evaluation
     */
    getValue: <T = any>(context?: EvaluationContext, rootObject?: object) => T;
    /**
     * Determine if an expression can be written to, i.e. setValue() can be called.
     * The supplied root object overrides any specified in the context.
     * @param context the context in which the expression should be checked
     * @param rootObject the root object against which to evaluate the expression
     * @return {@code true} if the expression is writable; {@code false} otherwise
     * @throws EvaluationException if there is a problem determining if it is writable
     */
    isWritable: (context?: EvaluationContext, rootObject?: object) => boolean;
    /**
     * Set this expression in the provided context to the value provided.
     * The supplied root object overrides any specified in the context.
     * @param context the context in which to set the value of the expression
     * @param rootObject the root object against which to evaluate the expression
     * @param value the new value
     * @throws EvaluationException if there is a problem during evaluation
     */
    setValue: (context: EvaluationContext, rootObject: object, value: any) => void;
}

/**
 * Input provided to an expression parser that can influence an expression
 * parsing/compilation routine.
 */
interface ParserContext {
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

interface ExpressionParser {
    /**
     * Parse the expression string and return an Expression object you can use for repeated evaluation.
     * <p>Some examples:
     * <pre class="code">
     *     3 + 4
     *     name.firstName
     * </pre>
     * @param expressionString the raw expression string to parse
     * @param context a context for influencing this expression parsing routine (optional)
     * @return an evaluator for the parsed expression
     * @throws ParseException an exception occurred during parsing
     */
    parseExpression: (expressionString: string, context?: ParserContext) => Expression;
}

declare class SpelExpression implements Expression {
    private expression;
    constructor(expression: Expression);
    getExpressionString: () => string;
    getValue: <T = any>(context?: EvaluationContext, rootObject?: object) => any;
    isWritable: (context?: EvaluationContext, rootObject?: object) => boolean;
    setValue: (context: EvaluationContext, rootObject: object, value: any) => void;
}

declare class InternalSpelExpressionParser implements ExpressionParser {
    constructor(configuration?: any);
    parseExpression: (expressionString: string, context?: ParserContext) => SpelExpression;
}

/**
 *  Hand-written SpEL parser. Instances are reusable but are not thread-safe.
 */
declare class SpelExpressionParser implements ExpressionParser {
    private internalSpelExpressionParser;
    constructor(configuration?: any);
    parseExpression: (expressionString: string, context?: ParserContext) => SpelExpression;
    parseRaw: (expressionString: string) => SpelExpression;
}

/**
 * constant expression node
 */
declare class ConstantExpression implements Expression {
    private expressionString;
    private invokeFunction;
    constructor(expressionString: string);
    getExpressionString: () => string;
    getValue: <T = any>(context?: EvaluationContext, rootObject?: object) => any;
    isWritable: (context?: EvaluationContext, rootObject?: object) => boolean;
    setValue: (context: EvaluationContext, rootObject: object, value: any) => any;
}

declare class FunctionNodeExpression implements Expression {
    private expressionString;
    private invokeFunction;
    constructor(expressionString: string, parserContext?: ParserContext);
    getExpressionString: () => string;
    getValue: <T = any>(context?: EvaluationContext, rootObject?: object) => any;
    isWritable: (context?: EvaluationContext, rootObject?: object) => boolean;
    setValue: (context: EvaluationContext, rootObject: object, value: any) => any;
    private getExecuteVariableNames;
}

export { ConstantExpression, EvaluationContext, Expression, ExpressionParser, FunctionNodeExpression, InternalSpelExpressionParser, ParserContext, SpelExpression, SpelExpressionParser };
