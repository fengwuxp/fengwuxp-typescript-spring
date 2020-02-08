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
import {ModulePackageInfo} from "../ModulePackageInfo";

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


/**
 * 查找到导入语句
 * @param file
 * @param modulePackageInfo
 */
export const findImportDeclaration = (file: File, modulePackageInfo: ModulePackageInfo | string): ImportDeclaration => {
    const program = file.program;
    return findImportDeclarationByProgram(program, modulePackageInfo);
};


/**
 * 查找导入语句
 * @param program
 * @param modulePackageInfo
 */
export const findImportDeclarationByProgram = (program: Program, modulePackageInfo: ModulePackageInfo | string) => {

    return findImportDeclarationByStatements(program.body, modulePackageInfo);
};


export const findImportDeclarationByStatements = (statements: Statement[], modulePackageInfo: ModulePackageInfo | string) => {

    const packageName: string | string[] = typeof modulePackageInfo == "string" ? modulePackageInfo : modulePackageInfo.packageName;

    // 通过包名从导入语句中得到模块名，防止有重复的模块名称而发生误判
    return statements.filter((node) => {
        return isImportDeclaration(node);
    }).find((node: ImportDeclaration) => {
        const importValue = node.source.value;
        if (Array.isArray(packageName)) {
            return packageName.indexOf(importValue) >= 0;
        }
        return importValue === packageName

    }) as ImportDeclaration;
};

export const resolveModuleName = (file: File, modulePackageInfo: ModulePackageInfo) => {

    // 通过包名从导入语句中得到模块名，防止有重复的模块名称而发生误判
    const importDeclaration: ImportDeclaration = findImportDeclarationByProgram(file.program, modulePackageInfo);
    if (importDeclaration == null) {
        return;
    }
    if (importDeclaration.specifiers.length === 1) {
        return importDeclaration.specifiers[0].local.name;
    } else {
        return modulePackageInfo.moduleName;
    }
};
