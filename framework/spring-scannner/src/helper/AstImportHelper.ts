import {File, ImportDeclaration, isImportDeclaration, Statement} from "@babel/types";

/**
 * ast import helper
 **/


/**
 * 获取 import declaration
 * @param file
 * @param name import name
 */
export const getImportDeclaration = (file: File, name: string): ImportDeclaration => {

    const program = file.program;


    const statements: Statement[] = program.body;

    return statements.filter((node) => {
        return isImportDeclaration(node);
    }).find((node: ImportDeclaration) => node.specifiers.find((specifier)=>{

        return specifier.local.name===name;
    })!=null) as ImportDeclaration;

};
