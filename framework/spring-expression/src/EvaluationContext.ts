/**
 * Expressions are executed in an evaluation context. It is in this context that
 * references are resolved when encountered during expression evaluation.
 */
export type EvaluationContext = Record<string, any> | Array<any> | Map<string | number, any> | Set<any>;

