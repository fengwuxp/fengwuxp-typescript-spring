import {
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
    Program,
    Statement,
    TSDeclareFunction,
    VariableDeclarator
} from "@babel/types";


// 查找特定名称的非import Declaration
export const findDefaultDeclarationByName = (file: File, name: string) => {

    const statements: Statement[] = file.program.body;
    return statements.filter(node => {
        return !isImportDeclaration(node)
    }).find((node) => {
        if (isClassDeclaration(node)) {
            return node.id.name === name;
        }
        if (isFunctionDeclaration(node)) {
            return node.id.name === name;
        }
        if (isVariableDeclaration(node)) {
            const variableDeclarators: Array<VariableDeclarator> = node.declarations;
            return (variableDeclarators[0].id as Identifier).name === name;
        }
    }) as any;
};

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
        // return statements.filter((node) => {
        //     return !isImportDeclaration(node);
        // }).find((node) => {
        //     if (isClassDeclaration(node)) {
        //         return node.id.name === declaration.name;
        //     }
        //     if (isFunctionDeclaration(node)) {
        //         return node.id.name === declaration.name;
        //     }
        //     if (isVariableDeclaration(node)) {
        //         const variableDeclarators: Array<VariableDeclarator> = node.declarations;
        //         return (variableDeclarators[0].id as Identifier).name === declaration.name;
        //     }
        // }) as any;
        return findDefaultDeclarationByName(file, declaration.name);
    } else {

        return declaration;
    }

};


