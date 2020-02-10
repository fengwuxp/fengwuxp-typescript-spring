import {TypeFilter} from "../../src/core/type/TypeFilter";
import {PathMatchFilter} from "../../src/core/type/PathMatchFilter";
import {logger} from "../../src/debug/Log4jsHelper";
import path from 'path';


describe("test path match type filter", () => {


    test("test 1", () => {

        const filter: TypeFilter = new PathMatchFilter([
            // path.normalize("/example/**"),
            "/example/*.tsx"
            // path.normalize("/example/**.tsx")
        ]);

        logger.debug(filter.match({
            filepath: path.normalize("/example/a/b")
        }));
        logger.debug(filter.match({
            filepath: "/example/a.tsx"
        }));
        logger.debug(filter.match({
            filepath: "/example/b/a.tsx"
        }));
        logger.debug(filter.match({
            filepath: path.normalize("/h/example/a/b")
        }));
    })

});
