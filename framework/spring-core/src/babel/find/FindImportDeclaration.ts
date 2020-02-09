import {File, ImportDeclaration, isImportDeclaration, Program, Statement} from "@babel/types";
import {ModulePackageInfo} from "../ModulePackageInfo";


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
 * 获取 import declaration
 * @param file
 * @param moduleName import name
 */
export const findImportDeclarationByModuleName = (file: File, moduleName: string): ImportDeclaration => {

    const program = file.program;
    const statements: Statement[] = program.body;

    return statements.filter((node) => {
        return isImportDeclaration(node);
    }).find((node: ImportDeclaration) => node.specifiers.find((specifier) => {

        return specifier.local.name === moduleName;
    }) != null) as ImportDeclaration;

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

/**
 * 从导入语句中解析模块名称
 * @param file
 * @param modulePackageInfo
 */
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
