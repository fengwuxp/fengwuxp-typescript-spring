import {File, isCallExpression, isFunctionDeclaration, isVariableDeclaration, VariableDeclaration} from "@babel/types";
import {ModulePackageInfo} from "../ModulePackageInfo";
import {findExportDefaultDeclaration, resolveModuleName} from "./FindAst";
import {matchCallExpression} from "./FindCallExpression";


/**
 * 匹配默认的Variable
 * @param file
 * @param modulePackageInfo
 */
export const findVariableDeclarationByExportDefault = (file: File, modulePackageInfo: ModulePackageInfo) => {

    const defaultDeclaration = findExportDefaultDeclaration(file);
    if (defaultDeclaration == null) {
        return
    }

    if (!isVariableDeclaration(defaultDeclaration)) {
        return
    }
    const variableName: string = resolveModuleName(file, modulePackageInfo);
    if (variableName == null) {
        return
    }
    if (!matchVariableDeclaration(defaultDeclaration, variableName)) {
        return null;
    }
    return defaultDeclaration;
};

export const matchVariableDeclaration = (variableDeclaration: VariableDeclaration, variableName: string) => {

    const [variableDeclarator] = variableDeclaration.declarations;
    const init = variableDeclarator.init;
    if (isCallExpression(init)) {
        return matchCallExpression(init, variableName)
    }

    return false;
};
