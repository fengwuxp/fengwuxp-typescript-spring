import {
    CallExpression,
    ClassDeclaration,
    ExportDefaultDeclaration,
    Expression,
    File,
    FunctionDeclaration,
    Identifier,
    ImportDeclaration,
    isClassDeclaration,
    isExportDefaultDeclaration,
    isFunctionDeclaration,
    isIdentifier,
    isImportDeclaration,
    isVariableDeclaration,
    Statement,
    TSDeclareFunction,
    VariableDeclarator
} from "@babel/types";

/**
 * 查找一个模块文件的默认导出
 * @param file
 */
export const findExportDefaultDeclaration = (file: File): FunctionDeclaration | TSDeclareFunction | ClassDeclaration | Expression => {

    const statements: Statement[] = file.program.body;
    // 找到默认导出的节点
    const exportDefaultDeclarations: ExportDefaultDeclaration[] = statements.filter((node) => {
        return isExportDefaultDeclaration(node)
    }) as ExportDefaultDeclaration[];
    if (exportDefaultDeclarations.length == 0) {
        return null;
    }
    const exportDefaultDeclaration: ExportDefaultDeclaration = exportDefaultDeclarations[0];
    const declaration = exportDefaultDeclaration.declaration;
    if (isIdentifier(declaration)) {
        // 默认导出的节点是 Identifier
        return statements.filter((node) => {
            return !isImportDeclaration(node);
        }).find((node) => {
            if (isClassDeclaration(node)) {
                return node.id.name === declaration.name;
            }
            if (isFunctionDeclaration(node)) {
                return node.id.name === declaration.name;
            }
            if (isVariableDeclaration(node)) {
                const variableDeclarators: Array<VariableDeclarator> = node.declarations;
                return (variableDeclarators[0].id as Identifier).name === declaration.name;
            }
        }) as any;
    } else {

        return declaration;
    }

};


export type ModulePackageInfo = {
    packageName: string;
    moduleName?: string;
};
/**
 * 查找注解
 * @param file
 * @param modulePackageInfo
 */
export const findDecoratorByExportDefault = (file: File, modulePackageInfo: ModulePackageInfo) => {
    const program = file.program;
    if (program == null) {
        return null;
    }
    const {packageName, moduleName} = modulePackageInfo;
    const statements: Statement[] = program.body;

    // 通过包名从导入语句中得到模块名，防止有重复的模块名称而发生误判
    const importReactViewDecorator: ImportDeclaration = statements.filter((node) => {
        return isImportDeclaration(node);
    }).find((node: ImportDeclaration) => node.source.value === packageName) as ImportDeclaration;
    if (importReactViewDecorator == null) {
        return;
    }

    let _decoratorName: string;
    if (importReactViewDecorator.specifiers.length === 1) {
        _decoratorName = importReactViewDecorator.specifiers[0].local.name;
    } else {
        _decoratorName = moduleName;
    }
    const defaultDeclaration = findExportDefaultDeclaration(file);
    if (isClassDeclaration(defaultDeclaration)) {
        return findDecoratorByClassDeclaration(defaultDeclaration, _decoratorName);

    }
    return null;

};


/**
 *
 * @param direction
 * @param decoratorName
 */
export const findDecoratorByClassDeclaration = (direction: ClassDeclaration, decoratorName: string) => {
    const decorators = direction.decorators;
    if (decorators == null || decorators.length == 0) {
        return null;
    }

    return decorators.find((item) => {
        return (item.expression as CallExpression).callee["name"] === decoratorName;
    });
};
