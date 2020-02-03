import * as log4js from "log4js";
import * as assert from "assert";
import RouteView, {RouteViewOptions} from "../src/annotations/RouteView";
import spelRouteConditionParser from "../src/condition/SpelRouteConditionParser";
import {RouteContext, RouteContextFactory} from "../src/context/RouteContext";
import RouteContextHolder from "../src/context/RouteContextHolder";

const logger = log4js.getLogger();
logger.level = 'debug';


RouteView.setDefaultCondition(false);

RouteView.addEnhancer((target: any, options: RouteViewOptions) => {

    target.sayHello = () => {
        logger.debug("say hello 2");
    };
    return target;
});

RouteView.addEnhancer((target: any, options: RouteViewOptions) => {

    target.sayHello = () => {
        logger.debug("say hello 1");
    };
    return target;
});


@RouteView<{
    page: number
}>({
    page: 1
})
class Demo {

    test = () => {

    }
}

const DemoFun = RouteView<{
    page: number
}>({
    page: 1
})((props) => {

    return 1;
});


export interface MockRouteContext extends RouteContext {

    userInfo: any;
}

const mockRouteContextFactory: RouteContextFactory<MockRouteContext> = (): MockRouteContext => {


    return {
        pathname: "mock",
        uriVariables: {
            'a': 1,
            'b': 2
        },
        state: {
            c: 3,
            f: 4
        },
        userInfo: {
            name: "张三",
            enabled: true
        }
    }
}

describe("test routing", () => {

    const sleep = (times) => {
        return new Promise((resolve) => {
            setTimeout(resolve, times)
        })
    };


    test("test route view", () => {

        const test = {
            x: 1
        };
        // @ts-ignore
        logger.debug(test!.x)

        const demo = new Demo();

        Demo['sayHello']();

        const demoFun = DemoFun();
        DemoFun['sayHello']();
    })

    test("test condition route", () => {

        RouteContextHolder.setRouteContextFactory(mockRouteContextFactory);
        const routeContext = RouteContextHolder.getRouteContext();

        assert.equal(true, spelRouteConditionParser("${pathname =='mock'}", routeContext), "路径匹配失败");
        assert.equal(false, spelRouteConditionParser("${uriVariables.a =='mock'}", routeContext), "参数匹配失败")
        assert.equal(true, spelRouteConditionParser((mockRouteContext: MockRouteContext) => {
            logger.debug("mock rout context", mockRouteContext);
            return "${userInfo.enabled}"

        }, routeContext), "用户状态未启用")


    })

});

