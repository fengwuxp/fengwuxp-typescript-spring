import SwaggerParser from "@apidevtools/swagger-parser";
import * as log4js from "log4js";

const logger = log4js.getLogger();
logger.level = 'debug';
describe("test swagger api parser",()=>{

    test("remote api swagger3",async ()=>{
        const apiUrl="http://127.0.0.1:41000/operation/v3/api-docs"
        const api = await SwaggerParser.validate(apiUrl, {
            parse: {
                json: true
            }
        });
        logger.debug(api);
    })
})