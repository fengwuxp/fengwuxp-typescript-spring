import {EvaluationContext} from "./EvaluationContext";

/**
 * An expression capable of evaluating itself against context objects.
 * Encapsulates the details of a previously parsed expression string.
 * Provides a common abstraction for expression evaluation.
 */
export interface Expression {

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
    getValue: <T = any>(context?: EvaluationContext, rootObject?: object) => T

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
