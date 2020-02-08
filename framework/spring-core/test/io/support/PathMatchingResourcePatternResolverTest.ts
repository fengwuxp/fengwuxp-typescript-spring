import {ResourcePatternResolver} from "../../../src/io/support/ResourcePatternResolver";
import PathMatchingResourcePatternResolver from "../../../src/io/support/PathMatchingResourcePatternResolver";
import * as path from "path";
import {logger} from "../../../src/debug/Log4jsHelper";
import {fileURLToPath} from "url";

describe("test path match resource loader", () => {


    const basePath: string = path.join(__dirname, "../../../");

    logger.debug("path match ==>", basePath);

    const resourcePatternResolver: ResourcePatternResolver = new PathMatchingResourcePatternResolver(basePath);


    test("resource loader", () => {

        const resources = resourcePatternResolver.getResources("/src/**/type/**");

        resources.forEach(resource => {
            logger.debug(fileURLToPath(resource.getURL()));
        })
    })

});
