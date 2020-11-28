import {OpenApiParser} from "../OpenApiParser";
import SwaggerParser from "@apidevtools/swagger-parser";
import {OpenAPI, OpenAPIV2, OpenAPIV3} from "openapi-types";
import {TypeDefinition} from "../model/TypeDefinition";
import {SwaggerApiVersion} from "../enums/SwaggerApiVersion";


export abstract class AbstractSwaggerParser<T extends TypeDefinition = TypeDefinition> implements OpenApiParser<T[]> {

    protected api: string | OpenAPI.Document;

    protected options: SwaggerParser.Options;

    protected version: SwaggerApiVersion;


    constructor(api: string | OpenAPI.Document, version: number = SwaggerApiVersion.V3, options: SwaggerParser.Options = {
        parse: {
            json: true
        }
    }) {
        this.api = api;
        this.options = options;
        this.version = version;
    }

    parse = async (): Promise<T[]> => {
        const {api, options} = this;
        const document = await SwaggerParser.validate(api, options);
        const definitions = this.isV3() ? this.transformV3(document as OpenAPIV3.Document) : this.transformV2(document as OpenAPIV2.Document);
        return Promise.resolve(definitions);
    }

    protected isV3 = () => {
        return SwaggerApiVersion.V3 === this.version;
    }

    protected abstract transformV2: (document: OpenAPIV2.Document) => T[];
    protected abstract transformV3: (document: OpenAPIV3.Document) => T[];


}