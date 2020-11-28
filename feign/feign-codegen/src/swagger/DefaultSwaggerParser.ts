import {AbstractSwaggerParser} from './AbstractSwaggerParser';
import SwaggerParser from '@apidevtools/swagger-parser';
import {OpenAPI, OpenAPIV2, OpenAPIV3} from "openapi-types";
import {TypeDefinition} from 'model/TypeDefinition';


export default class DefaultSwaggerParser extends AbstractSwaggerParser {


    constructor(api: string | OpenAPI.Document, version: number, options: SwaggerParser.Options) {
        super(api, version, options);
    }


    protected transformV2 = (document: OpenAPIV2.Document): TypeDefinition[] => {

        return [];
    }

    protected transformV3 = (document: OpenAPIV3.Document): TypeDefinition[] => {
        const paths = document.paths;

        Object.keys(paths).map((key)=>{
            return paths[key];
        }).map((item)=>{

        })

        return [];
    }


}