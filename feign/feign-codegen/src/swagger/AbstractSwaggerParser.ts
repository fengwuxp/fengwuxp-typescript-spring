import SwaggerParser from "@apidevtools/swagger-parser";
import {OpenAPI, OpenAPIV2, OpenAPIV3} from "openapi-types";
import {TypeDefinition} from "../model/TypeDefinition";
import {OpenApiVersion} from "../enums/OpenApiVersion";
import {OpenApiCodegenOptions, OpenApiParseOptions} from "../OpenApiCodegenOptions";
import {SwaggerOpenApiParser} from './SwaggerOpenApiSupport';


export abstract class AbstractSwaggerParser<T extends TypeDefinition = TypeDefinition> implements SwaggerOpenApiParser<T> {

    protected api: string | OpenAPI.Document;

    protected swaggerOptions: SwaggerParser.Options;

    protected version: OpenApiVersion;

    protected parseOptions: OpenApiParseOptions


    constructor(api: string | OpenAPI.Document, swaggerOptions: SwaggerParser.Options = {
        parse: {
            json: true
        }
    }) {
        this.api = api;
        this.swaggerOptions = swaggerOptions;
    }

    parse = async (): Promise<T[]> => {
        const {api, swaggerOptions} = this;
        const document = await SwaggerParser.validate(api, swaggerOptions);
        if (document['openapi'] != null) {
            this.version = OpenApiVersion.V3;
        }
        const definitions = this.isV3() ? this.transformV3(document as OpenAPIV3.Document) : this.transformV2(document as OpenAPIV2.Document);
        return Promise.resolve(definitions);
    }

    protected isV3 = () => {
        return OpenApiVersion.V3 === this.version;
    }

    protected abstract transformV2: (document: OpenAPIV2.Document) => T[];
    protected abstract transformV3: (document: OpenAPIV3.Document) => T[];

    setOpenApiParseOptions = (options: OpenApiParseOptions): void => {
        this.parseOptions = options
    }


}