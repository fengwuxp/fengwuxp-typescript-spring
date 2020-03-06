import {ImportDeclaration, isImportDeclaration, Program,} from "@babel/types";

type FileFilter = (filename: string) => boolean;

export interface BabelPluginRewriteOptions {
    // 需要匹配的源代码目录
    includePackages?: string[] | RegExp[] | FileFilter,
    importTransformer: (importPath: string, filename: string) => string;
}


export default function (babel) {


    const Program = {
        enter(path, state) {
            const filename = path.hub.file.opts.filename;
            const {importTransformer, includePackages}: BabelPluginRewriteOptions = state.opts;
            if (typeof includePackages === "function") {
                if (!includePackages(filename)) {
                    return;
                }
            } else {
                const isInclude = (includePackages || []).some((item) => {
                    if (typeof item === "string") {
                        return filename.indexOf(item) >= 0;
                    } else {
                        return item.test(filename);
                    }
                });
                if (!isInclude) {
                    return;
                }
            }

            const program: Program = path.node;
            program.body.filter((node) => {
                return isImportDeclaration(node);
            }).forEach((declaration: ImportDeclaration) => {
                // 导入路径
                const importPath = declaration.source.value;
                declaration.source.value = importTransformer(importPath, filename);
            })
        },
        exit() {

        }
    };

    const result = {
        visitor: {Program}
    };

    return result;
}
