import {CodeGenerator} from "./CodeGenerator";
import {OpenApiParser} from '../OpenApiParser';
import {TypeDefinition} from '../model/TypeDefinition';
import {TemplateBuildStrategy} from "../template/TemplateBuildStrategy";
import {isEmpty} from "fengwuxp-common-utils/lib/collection/CollectionUtils";


export class AbstractSwaggerCodeGenerator<T extends TypeDefinition = TypeDefinition> implements CodeGenerator {


    protected openApiParser: OpenApiParser<T[]>;

    protected templateBuildStrategy: TemplateBuildStrategy<T>;


    constructor(openApiParser: OpenApiParser<T[]>, templateBuildStrategy: TemplateBuildStrategy<T>) {
        this.openApiParser = openApiParser;
        this.templateBuildStrategy = templateBuildStrategy;
    }

    generate = async (): Promise<void> => {
        const {templateBuildStrategy, openApiParser} = this;
        const definitions = await openApiParser.parse();

        definitions.forEach((definition) => {
            templateBuildStrategy.build(definition);
        });
    }


    protected getDescTemplate = () => {

    }

    protected getComments = (data: T) => {
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


}