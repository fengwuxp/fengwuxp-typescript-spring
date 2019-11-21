import * as log4js from "log4js";
import {appCommandRouterFactory} from '../src/AppCommandRouterFactory';
import {NavigatorAdapter, NavigatorDescriptorObject} from "../src/NavigatorAdapter";
import {AppCommandRouter, RouterCommandMethod} from "../src/AppCommandRouter";
import {RouterCommand} from "../src/RouterCommand";


const logger = log4js.getLogger();
logger.level = 'debug';

interface MockAppRouter extends NavigatorAdapter, AppCommandRouter {

    login: RouterCommandMethod;

    index: RouterCommandMethod;

    my: RouterCommandMethod;
}

describe("test  app command router factory", () => {

    const mockAppRouter: MockAppRouter = appCommandRouterFactory<MockAppRouter>({
        methodNameCommandResolver: () => {
            return (name) => name;
        },
        navigatorAdapter: <E extends NavigatorAdapter = NavigatorAdapter>(): E => {
            return {
                goBack: function (num?: number) {
                    logger.debug(`goBack`, num || 1);
                    return;
                },
                popToTop: function (navigatorDescriptorObject: NavigatorDescriptorObject) {
                    logger.debug(`popToTop`, navigatorDescriptorObject);
                    return;
                },
                push: function (navigatorDescriptorObject: NavigatorDescriptorObject) {
                    logger.debug(`push`, navigatorDescriptorObject)
                    return;
                },
                reLaunch: function (navigatorDescriptorObject: NavigatorDescriptorObject) {
                    logger.debug(`reLaunch`, navigatorDescriptorObject)
                    return;
                },
                replace: function (navigatorDescriptorObject: NavigatorDescriptorObject) {
                    logger.debug(`replace`, navigatorDescriptorObject)
                    return;
                }

            } as E;
        }

    });

    test("test mock app router", () => {

        mockAppRouter.index();
        mockAppRouter.index({
            a: 1
        }, RouterCommand.RESET);

        mockAppRouter.goBack();
        mockAppRouter.push({
            pathname:"goods_list"
        });
    })

});
