import {Decorator, File, isCallExpression, isClassDeclaration, isIdentifier} from "@babel/types";
import {findExportDefaultDeclaration, resolveModuleName} from "./FindAst";
import {ModulePackageInfo} from "../ModulePackageInfo";


/**
 * 查找装饰器
 *
 * @param file
 * @param modulePackageInfo
 */
export const findDecoratorByExportDefault = (file: File, modulePackageInfo: ModulePackageInfo) => {
    const defaultDeclaration = findExportDefaultDeclaration(file);
    if (!isClassDeclaration(defaultDeclaration)) {
        return;
    }
    const decoratorName: string = resolveModuleName(file, modulePackageInfo);
    if (decoratorName == null) {
        return
    }
    return findDecorator(defaultDeclaration.decorators, decoratorName);
};



/**
 * 匹配到期望的装饰器
 * @param decorator
 * @param decoratorName  装饰器名称
 */
export const matchDecorator = (decorator: Decorator, decoratorName: string) => {

    const expression = decorator.expression;
    if (isCallExpression(expression)) {
        return expression.callee["name"] === decoratorName;
    }

    if (isIdentifier(expression)){
        return expression.name === decoratorName;
    }


    return false;
};



const findDecorator = (decorators: Decorator[], decoratorName: string) => {
    if (decorators == null || decorators.length == 0) {
        return null;
    }

    return decorators.find((item) => {
        return matchDecorator(item, decoratorName);
    });
};
