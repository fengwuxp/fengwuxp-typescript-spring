import {AbstractSwaggerCodeGenerator} from "./AbstractSwaggerCodeGenerator";
import { OpenApiParser } from '../OpenApiParser';
import {TypeDefinition} from "../model/TypeDefinition";
import { TemplateBuildStrategy } from '../template/TemplateBuildStrategy';


export default class TypescriptCodeGenerator extends AbstractSwaggerCodeGenerator{

    constructor(openApiParser: OpenApiParser<TypeDefinition[]>,
                templateBuildStrategy: TemplateBuildStrategy<TypeDefinition>) {
        super(openApiParser, templateBuildStrategy);
    }



}