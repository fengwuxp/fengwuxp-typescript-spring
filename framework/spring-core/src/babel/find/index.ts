import {findDecoratorByExportDefault} from "./FindDecorator";
import {findCallExpressByExportDefault} from "./FindCallExpression";
import {findVariableDeclarationByExportDefault} from "./FindVariableDeclaration";


/**
 * 查找默认导出模块的处理器
 */
export const findDefaultDeclarationHandlers = [findDecoratorByExportDefault, findCallExpressByExportDefault, findVariableDeclarationByExportDefault];
