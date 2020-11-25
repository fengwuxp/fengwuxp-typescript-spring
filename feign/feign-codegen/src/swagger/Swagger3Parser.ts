import {OpenApiParser} from "../OpenApiParser";
import SwaggerParser from "@apidevtools/swagger-parser";


export class Swagger3Parser implements OpenApiParser<any> {

    parse = async (): Promise<any> => {

        const api = await SwaggerParser.validate("", {
            parse: {
                json: true
            }
        });

        // const parser = new SwaggerParser();
        // const api = await parser.dereference("my-api.yaml");


        return Promise.resolve(undefined);
    }


}