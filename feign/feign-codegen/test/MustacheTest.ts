import Mustache from "mustache";
import Handlebars from "handlebars";
import * as path from "path";
import * as fs from "fs";
import * as log4js from "log4js";
import {TYPESCRIPT} from '../src/model/LanguageDescription';
import {TypeDefinition} from "../src/model/TypeDefinition";
import {ClassDefinitionType} from "../src/enums/ClassDefinitionType";
import {TemplateBuildStrategy} from "../src/template/TemplateBuildStrategy";
import HbsTemplateBuildStrategy from "../src/template/HbsTemplateBuildStrategy";
import SimpleTemplateOutputStrategy from "../src/template/SimpleTemplateOutputStrategy";
import {TemplateLoader} from "../src/template/TemplateLoader";
import {isEmpty} from "fengwuxp-common-utils/lib/collection/CollectionUtils";
import {NUMBER, STRING, VOID} from '../src/language/TypescriptTypeDefinition';
import {createTypeDefinition} from "../src/util/TypeDefinitionUtil";
import {AuthenticationType, HttpMethod} from "../../feign/src";

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
        const templateDelegate = Handlebars.compile("{{title}} spends {{calc}}");
        logger.debug(templateDelegate(view))
    });

    const outputDir = path.resolve(__dirname, "example/src");
    logger.debug("输出的文件的目录为：{}", outputDir);
    const getComments = (data: TypeDefinition) => {
        const {fields, methods} = data;
        if (isEmpty(methods) && !isEmpty(fields)) {
            return fields.map(field => {
                return field.desc;
            });
        }
        if (isEmpty(fields) && !isEmpty(methods)) {
            return methods.map(field => {
                return field.desc;
            });
        }
        return [];
    }
    const templateBuildStrategy: TemplateBuildStrategy<TypeDefinition> = new HbsTemplateBuildStrategy(TYPESCRIPT,
        new SimpleTemplateOutputStrategy(outputDir, TYPESCRIPT),
        (data, loader: TemplateLoader) => {
            const descTemplate = loader.load("desc");
            return {
                memberDesc: Handlebars.compile(descTemplate)
            }
        })
    const Sex = createTypeDefinition("Sex", {
        type: ClassDefinitionType.ENUM,
        name: "Sex",
        desc: "性别",
        package: "src/enums/",
        fields: [
            {
                name: "MAN",
                desc: "男",
                required: true,
                filedType: STRING
            },
            {
                name: "WOMAN",
                desc: "女",
                required: true,
                filedType: STRING
            }
        ]
    });
    const dtos: TypeDefinition[] = [

        createTypeDefinition("ExampleReq", {
            type: ClassDefinitionType.CLASS,
            name: "ExampleReq",
            genericName: "",
            desc: "这是一个样例描述",
            dependencies: [
                Sex
            ],
            fields: [
                {
                    name: "name",
                    required: true,
                    filedType: NUMBER
                },
                {
                    name: "age",
                    desc: "年龄",
                    filedType: NUMBER
                },
                {
                    name: "isMain",
                    desc: "is main",
                    filedType: NUMBER
                },
                {
                    name: "sex",
                    filedType: Sex
                },
                {
                    name: "birthday",
                    desc: "生日",
                    filedType: NUMBER
                },
                {
                    name: "values",
                    filedType: NUMBER
                }
            ]
        }),
        Sex
    ]


    test("dto object codegen", () => {

        dtos.forEach((value) => {
            templateBuildStrategy.build(value);
        });
        fs.rmdirSync(outputDir, {recursive: true});
    })

    test("feign client  codegen", () => {

        const ExampleReq = createTypeDefinition("QueryExampleReq", {
            fields: [
                {
                    name: "age",
                    filedType: NUMBER
                }
            ]
        });
        const exampleClients: TypeDefinition[] = [
            createTypeDefinition("ExampleFeignClient", {
                dependencies: [
                    ExampleReq
                ],
                methods: [
                    {
                        name: "queryExample",
                        desc: "查询测试",
                        returnType: NUMBER,
                        annotations: [
                            {
                                name: "GetMapping",
                                namedArguments: {
                                    value: "'/query_example'",
                                    method: "HttpMethod.GET",
                                    authenticationType: "AuthenticationType.TRY",
                                },
                                positionArguments: ["/query_example"]
                            }
                        ]
                    },
                    {
                        name: "postExample",
                        desc: "post测试",
                        returnType: VOID,
                        annotations: [
                            {
                                name: "PostMapping",
                                namedArguments: {
                                    value: "'/post_example'",
                                    method: "HttpMethod.POST",
                                    authenticationType: "AuthenticationType.TRY",
                                },
                                positionArguments: ["/query_example"]
                            }
                        ],
                        params: [
                            {
                                name: "req",
                                parameterType: ExampleReq
                            }
                        ]
                    }
                ]
            })
        ]

        exampleClients.forEach((value) => {
            value.dependencies.forEach((dto) => {
                templateBuildStrategy.build(dto);
            });
            templateBuildStrategy.build(value);
        });
        // fs.rmdirSync(outputDir, {recursive: true});
    })
})