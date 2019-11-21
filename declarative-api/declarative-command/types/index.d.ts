/**
 * method to command resolver
 */
declare type MethodNameCommandResolver = (method: string) => string;

declare const toHumpResolver: MethodNameCommandResolver;
declare const toLineResolver: MethodNameCommandResolver;
declare const toUpperCaseResolver: MethodNameCommandResolver;
declare const toLocaleUpperCaseResolver: MethodNameCommandResolver;
declare const reduceCommandResolvers: (...resolvers: MethodNameCommandResolver[]) => MethodNameCommandResolver;

export { MethodNameCommandResolver, reduceCommandResolvers, toHumpResolver, toLineResolver, toLocaleUpperCaseResolver, toUpperCaseResolver };
