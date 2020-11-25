import Mustache from "mustache";
import * as path from "path";
import * as fs from "fs";
import * as log4js from "log4js";
import {TYPESCRIPT} from '../src/model/LanguageDescription';
import {TypeDefinition} from "../src/model/TypeDefinition";
import {ClassDefinitionType} from "../src/enums/ClassDefinitionType";
import {TemplateBuildStrategy} from "../src/template/TemplateBuildStrategy";
import MustacheTemplateBuildStrategy from "../src/template/MustacheTemplateBuildStrategy";
import SimpleTemplateOutputStrategy from "../src/template/SimpleTemplateOutputStrategy";

const logger = log4js.getLogger();
logger.level = 'debug';
describe("test mustache template", () => {

    test("remote api swagger3", async () => {
        const view = {
            title: "Joe",
            calc: function () {
                return 2 + 4;
            }
        };

        const result = Mustache.render("{{title}} spends {{calc}}", view);
        logger.debug(result);
    });

    const outputDir = path.resolve(__dirname, "example/src");
    logger.debug("输出的文件的目录为：{}", outputDir);
    const templateBuildStrategy: TemplateBuildStrategy<TypeDefinition> = new MustacheTemplateBuildStrategy(TYPESCRIPT,
        new SimpleTemplateOutputStrategy(outputDir, TYPESCRIPT))

    test("dto object codegen", () => {
        const typeDefinitions: TypeDefinition[] = [
            {
                type: ClassDefinitionType.CLASS,
                name: "ExampleReq",
                desc: "这是一个样例描述",
                dependencies: [
                    {
                        type: ClassDefinitionType.ENUM,
                        name: "Sex",
                        package: "/enums/",
                        fullname: "../enums/Sex"
                    }
                ],
                fields: [
                    {
                        name: "name",
                        required: true,
                        typeDefinition: "string"
                    },
                    {
                        name: "age",
                        desc: "年龄",
                        typeDefinition: "number"
                    },
                    {
                        name: "isMain",
                        desc: "is main",
                        typeDefinition: "boolean"
                    },
                    {
                        name: "sex",
                        typeDefinition: "Sex"
                    },
                    {
                        name: "birthday",
                        desc: "生日",
                        typeDefinition: "Date"
                    },
                    {
                        name: "values",
                        typeDefinition: "string[]"
                    }
                ]
            },
            {
                type: ClassDefinitionType.ENUM,
                name: "Sex",
                desc: "性别",
                fields: [
                    {
                        name: "MAN",
                        desc: "男",
                        required: true,
                        typeDefinition: "string"
                    },
                    {
                        name: "WOMAN",
                        desc: "女",
                        required: true,
                        typeDefinition: "string"
                    }
                ]
            }
        ]

        typeDefinitions.forEach((value) => {
            templateBuildStrategy.build(value);
        });
        fs.rmdirSync(outputDir, {recursive: true});
    })
})