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
import {createTypeDefinition} from "../src/util/TypeDefinitionUtils";
import {OUTPUT_DIR_TAG} from '../src/constant/ConstantVariables';

const logger = log4js.getLogger();
logger.level = 'debug';

describe("test hbs template", () => {

    test("hbs simple", async () => {
        const view = {
            title: "Joe",
            calc: function () {
                return 2 + 4;
            }
        };
        const templateDelegate = Handlebars.compile("{{title}} spends {{calc}}");
        logger.debug(templateDelegate(view));

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
            const descTemplate = "";
            return {
                memberDesc: Handlebars.compile(descTemplate)
            }
        })
    const Sex = createTypeDefinition("Sex", {
        type: ClassDefinitionType.ENUM,
        name: "Sex",
        desc: "性别",
        package: "../enums/",
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
            package: "../model/req/",
            desc: "这是一个样例描述",
            dependencies: [
                Sex
            ],
            tags: [
                `${OUTPUT_DIR_TAG}req`
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

    const codegen = (definition: TypeDefinition) => {
        templateBuildStrategy.build(definition);
        const typeDefinitions = definition.dependencies;
        if (typeDefinitions == null) {
            return
        }
        typeDefinitions.forEach((value, index, array) => {
            codegen(value);
        })
    }

    test("dto object codegen", () => {

        dtos.forEach((value) => {
            templateBuildStrategy.build(value);
        });
        fs.rmdirSync(outputDir, {recursive: true});
    })

    test("feign client  codegen", () => {

        const ExampleInfo = createTypeDefinition("ExampleInfo", {
            package: "../model/info/",
            tags: [
                `${OUTPUT_DIR_TAG}info`
            ],
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
                    ExampleInfo,
                    ...dtos
                ],
                annotations: [
                    {
                        name: "Feign",
                        namedArguments: {
                            value: "'/example'"
                        },
                        positionArguments: ["/example"]
                    }
                ],
                methods: [
                    {
                        name: "queryExample",
                        desc: "查询测试",
                        returnType: ExampleInfo,
                        annotations: [
                            {
                                name: "GetMapping",
                                namedArguments: {
                                    value: "'/query_example'",
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
                                    authenticationType: "AuthenticationType.TRY",
                                },
                                positionArguments: ["/query_example"]
                            }
                        ],
                        params: [
                            {
                                name: "req",
                                parameterType: dtos[0]
                            }
                        ]
                    }
                ]
            })
        ]

        exampleClients.forEach((value) => {
            codegen(value);
        });

        fs.rmdirSync(outputDir, {recursive: true});
    })
})