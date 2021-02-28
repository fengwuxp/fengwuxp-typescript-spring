import * as log4js from "log4js";
import {RouteMethodResolver} from "../../src/resolve/RouteMethodResolver";
import DefaultRouteMethodResolver from "../../src/resolve/DefaultRouteMethodResolver";

const logger = log4js.getLogger();
logger.level = 'debug';


describe(' router method resolver test', () => {


    const routeMethodResolver: RouteMethodResolver = new DefaultRouteMethodResolver();

    test("test default router method resolver", () => {

        let uris = [
            "/a_b/index",
            "/member/:id",
            "order/detail/:sn"
        ];
        const names = uris.map((s) => {
            return routeMethodResolver.uriToMethodName(s)
        });
        const uris2 = uris.map((s) => {
            return routeMethodResolver.methodNameToUri(s)
        });
        logger.debug(names);
        logger.debug(uris2);
    })
});