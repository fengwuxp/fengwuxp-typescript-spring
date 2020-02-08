import {CallExpression, File, isCallExpression, isIdentifier} from "@babel/types";
import {ModulePackageInfo} from "../ModulePackageInfo";
import {findExportDefaultDeclaration, resolveModuleName} from "./FindAst";


/**
 * 查找默认导出的 表达式
 * @param file
 * @param modulePackageInfo
 */
export const findCallExpressByExportDefault = (file: File, modulePackageInfo: ModulePackageInfo) => {
    const defaultDeclaration = findExportDefaultDeclaration(file);
    if (defaultDeclaration == null) {
        return
    }
    if (!isCallExpression(defaultDeclaration)) {
        return
    }
    const callName: string = resolveModuleName(file, modulePackageInfo);
    if (callName == null) {
        return
    }
    if (!matchCallExpression(defaultDeclaration, callName)) {
        return null;
    }
    return defaultDeclaration;
};


/**
 * 匹配调用表达式
 * @param callExpression
 * @param name
 */
export const matchCallExpression = (callExpression: CallExpression, name: string) => {

    const callee = callExpression.callee;
    if (isIdentifier(callee)) {
        return callee.name == name;
    }
    if (isCallExpression(callee)) {
        return matchCallExpression(callee, name);
    }
};
