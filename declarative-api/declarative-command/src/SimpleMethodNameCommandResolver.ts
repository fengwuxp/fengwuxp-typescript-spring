import {MethodNameCommandResolver} from "./MethodNameCommandResolver";


export const noneResolver: MethodNameCommandResolver = (methodName) => methodName;

export const toHumpResolver: MethodNameCommandResolver = (methodName: string) => methodName.replace(/\\_(\w)/g, (all, letter) => {
    return letter.toUpperCase();
});


export const toLineResolver: MethodNameCommandResolver = (methodName: string) => {
    return methodName.replace(/([A-Z])/g, "_$1").toLowerCase();
};

export const toUpperCaseResolver: MethodNameCommandResolver = (methodName: string) => {

    return methodName.toUpperCase();
};

export const toLocaleUpperCaseResolver: MethodNameCommandResolver = (methodName: string) => {

    return methodName.toLocaleUpperCase();
};

export const reduceCommandResolvers = (...resolvers: MethodNameCommandResolver[]): MethodNameCommandResolver => {

    return (methodName: string) => {
        return resolvers.reduce((prev, resolver) => {
            return resolver(prev);
        }, methodName);
    }
};
