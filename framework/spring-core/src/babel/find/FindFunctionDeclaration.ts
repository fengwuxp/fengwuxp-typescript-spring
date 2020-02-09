import {File, FunctionDeclaration, isFunctionDeclaration} from "@babel/types";
import {ModulePackageInfo} from "../ModulePackageInfo";
import {findExportDefaultDeclaration} from "./FindAst";
import { resolveModuleName } from './FindImportDeclaration';


/**
 * 查找默认导出的 函数
 * @param file
 * @param modulePackageInfo
 */
export const findFunctionDeclarationByExportDefault = (file: File, modulePackageInfo: ModulePackageInfo) => {

    const defaultDeclaration = findExportDefaultDeclaration(file);
    if (defaultDeclaration == null) {
        return
    }

    if (!isFunctionDeclaration(defaultDeclaration)) {
        return
    }
    const funcName: string = resolveModuleName(file, modulePackageInfo);
    if (funcName == null) {
        return
    }
    return matchFunctionDeclaration(defaultDeclaration, funcName);
};


/**
 * 匹配函数表达式
 * @param declaration
 * @param functionName
 */
export const matchFunctionDeclaration = (declaration: FunctionDeclaration, functionName: string) => {


    return false;
};



