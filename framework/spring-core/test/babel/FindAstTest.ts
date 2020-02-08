import * as path from "path";
import {logger} from "../../src/debug/Log4jsHelper";
import {ResourcePatternResolver} from "../../src/io/support/ResourcePatternResolver";
import PathMatchingResourcePatternResolver from "../../src/io/support/PathMatchingResourcePatternResolver";
import * as fs from "fs";
import {fileURLToPath} from "url";
import {parse} from "@babel/parser";
import {findDecoratorByExportDefault} from "../../src/babel/find/FindDecorator";
import {findCallExpressByExportDefault} from "../../src/babel/find/FindCallExpression";
import {findVariableDeclarationByExportDefault} from "../../src/babel/find/FindVariableDeclaration";

describe("test babel helper", () => {


    const basePath: string = path.join(__dirname, "../");

    logger.debug("path match ==>", basePath);

    const resourcePatternResolver: ResourcePatternResolver = new PathMatchingResourcePatternResolver(basePath);


    test("test find decorator", () => {

        const resources = resourcePatternResolver.getResources("/example/**/member/**");
        if (resources.length == 0) {
            return;
        }
        const handles = [findDecoratorByExportDefault, findCallExpressByExportDefault, findVariableDeclarationByExportDefault];
        resources.map(resource => {
            return fs.readFileSync(fileURLToPath(resource.getURL()), "UTF-8")
        }).map((sourceCodeText) => {
            return parse(sourceCodeText, {
                sourceType: "module",
                plugins: [
                    "typescript",
                    "classProperties",
                    "decorators-legacy"
                ]
            })
        }).map((file) => {

            const modulePackageInfo = {
                packageName: '../../ViewMapping',
                moduleName: "ViewMapping"
            };
            return handles.reduce((prev, handle) => {
                if (prev == null) {
                    return handle(file, modulePackageInfo);
                }
                return prev;
            }, null);
        }).forEach(result => {
            logger.debug("result", result);
        })

    })

});
