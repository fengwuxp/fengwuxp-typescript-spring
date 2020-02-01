import * as log4js from "log4js";
import RouteView, {RouteViewOptions} from "../src/annotations/RouteView";

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


@RouteView()
class Demo {

    test = () => {

    }
}

const DemoFun = RouteView()(() => {

});


describe("test routing", () => {

    const sleep = (times) => {
        return new Promise((resolve) => {
            setTimeout(resolve, times)
        })
    };


    test("test route view", () => {

        const demo = new Demo();

        Demo['sayHello']();

        // const demoFun = DemoFun();
        DemoFun['sayHello']();
    })


});

