import * as log4js from "log4js";
import {appCommandRouterFactory} from '../src/AppCommandRouterFactory';
import {NavigatorAdapter, NavigatorDescriptorObject} from "../src/NavigatorAdapter";
import {AppCommandRouter, RouterCommandMethod} from "../src/AppCommandRouter";
import {RouterCommand} from "../src/RouterCommand";
import {tryConverterPathnameVariableResolver} from "../src/PathnameMethodNameCommandResolver";
import {toLineResolver} from "fengwuxp-declarative-command";
import {AppRouterMapping, AppRouterMappingConfiguration} from '../src/annotations/AppRouterMapping';
import {RouteMapping} from '../src/annotations/RouteMapping';
import {AbstractAppCommandRouter} from "../src";
import {stringify} from "query-string";
import DefaultWrapperNavigatorAdapter from "../src/DefaultWrapperNavigatorAdapter";


const logger = log4js.getLogger();
logger.level = 'debug';

interface MockAppRouter extends NavigatorAdapter, AppCommandRouter {

    login: RouterCommandMethod;

    isLoginView: () => boolean;

    index: RouterCommandMethod;

    webview: RouterCommandMethod;

    my: RouterCommandMethod;

    goodsById: RouterCommandMethod<number>;

    popToTopGoodsDetail: RouterCommandMethod<{ id: number }>;

    pushOrderDetail: RouterCommandMethod<{ id: string }>;

    toOrderDetail: RouterCommandMethod<{ id: string }>;

    isOrderDetailView: () => boolean;

    pushOrderDetailById: RouterCommandMethod<string>;

    toModuleByUserId: RouterCommandMethod<[string, number]>;

    reLaunchOrderDetailById: RouterCommandMethod<string>;

    replaceOrderDetailById: RouterCommandMethod<string>;
}

const mockNavigatorContextAdapter = {
    getBrowseHistory: function () {
        return undefined;
    },
    getCurrentObject: function () {
        return undefined;
    },
    getCurrentPathname: function () {
        return "";
    },
    getCurrentState: function () {
        return undefined;
    },
    getCurrentUriVariables: function () {
        return undefined;
    },
    isStackTop: function () {
        return false;
    },
    isView: function (p1: string) {
        return false;
    }

};
const mockNavigatorAdapter = {
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

} as any;
let k = 0;

@AppRouterMapping({
    navigatorAdapter: () => mockNavigatorAdapter,
    navigatorContextAdapter: () => mockNavigatorContextAdapter,
    methodNameCommandResolver: () => toLineResolver,
    confirmBeforeJumping: () => {
        return (object) => {
            // logger.debug("需要重定向到登录页面", object);
            // return (object) => {
            //     logger.debug("需要重定向到登录页面", object);
            //     // return mockAppCommandRouter.login();
            //     return mockAppCommandRouter.push;
            // }
            return (object) => {
                return new Promise((resolve, reject) => {
                    resolve(k++ % 2 === 0)
                }).then((flag) => {
                    if (flag) {
                        console.log("继续跳转", object);
                        return mockAppCommandRouter.push(object);
                    } else {
                        console.log("需要重定向到登录页面", object);
                        return mockAppCommandRouter.login();
                    }
                })
            }
        }
    }
})
abstract class AbstractCommandRouter extends AbstractAppCommandRouter {
    constructor(configuration?: AppRouterMappingConfiguration) {
        super();
    }
}

class MockAppCommandRouter extends AbstractCommandRouter {

    constructor(configuration?: AppRouterMappingConfiguration) {
        super(configuration);
    }

    @RouteMapping("login_view", false)
    login: RouterCommandMethod;

    @RouteMapping("home")
    homeView: RouterCommandMethod;

    @RouteMapping()
    goodsListView: RouterCommandMethod;

    @RouteMapping("account/BindMobilePhoneView", false)
    bindMobile: RouterCommandMethod;


    reLaunchIndex: RouterCommandMethod;
}

const mockAppCommandRouter = new MockAppCommandRouter({
    confirmBeforeJumping: () => {
        logger.debug("=====mock app router==========>")
        return (object) => {
            return true;
        }
    }
});


describe("test  app command router factory", () => {

    const mockAppRouter: MockAppRouter = appCommandRouterFactory<MockAppRouter>({
        navigatorContextAdapter: () => {
            return mockNavigatorContextAdapter;
        },
        methodNameCommandResolver: () => toLineResolver,
        navigatorAdapter: <E extends NavigatorAdapter = NavigatorAdapter>(): E => {
            return mockNavigatorAdapter
        }
    });

    mockAppRouter.push({
        pathname: "/index?a=1",
        uriVariables: {}
    })


    test("test mock annotation", () => {
        mockAppCommandRouter.push('/home');
        mockAppCommandRouter.login({id: 2}, {name: "2"});
        mockAppCommandRouter.homeView(null, RouterCommand.RESET);
        mockAppCommandRouter.bindMobile();
        mockAppCommandRouter.goodsListView();
        const navigatorAdapter = mockAppCommandRouter.getNavigatorAdapter();
        logger.debug(navigatorAdapter);
        mockAppCommandRouter.push("/test", {id: 2}, {name: "2"});
        mockAppCommandRouter.reLaunchIndex();
    });

    test("test mock app router", () => {

        mockAppRouter.login();
        logger.debug("--->", mockAppRouter.isLoginView());
        logger.debug("--->", mockAppRouter.getCurrentPathname());
        logger.debug("--->", mockAppRouter.isStackTop());
        mockAppRouter.webview({url: 1});
        mockAppRouter.index();

        mockAppRouter["home"]();

        mockAppRouter.index({
            a: 1
        }, RouterCommand.RESET);

        mockAppRouter.goodsById(100);


        mockAppRouter.popToTopGoodsDetail({id: 100});

        mockAppRouter.pushOrderDetail({id: "100"});

        mockAppRouter.pushOrderDetailById("100");

        mockAppRouter.toOrderDetail({id: "1"});
        logger.debug(" mockAppRouter.isOrderDetailView()", mockAppRouter.isOrderDetailView());

        mockAppRouter.reLaunchOrderDetailById("1");
        logger.debug("--->", mockAppRouter.getCurrentPathname());
        logger.debug("--->", mockAppRouter.isStackTop());
        mockAppRouter.replaceOrderDetailById("1");

        mockAppRouter.toModuleByUserId(["member", 1]);

        mockAppRouter.goBack();

        mockAppRouter.push({
            pathname: "goods_list",
            uriVariables: {id: 2},
            state: {}
        });
        mockAppRouter.push("goods_list", {id: 2});
        mockAppRouter.toView("goods_list", {id: 2});

        logger.debug("--->", mockAppRouter.getCurrentPathname());
        logger.debug("--->", mockAppRouter.isStackTop());
        logger.debug("--->", mockAppRouter.getCurrentUriVariables());
        logger.debug("--->", mockAppRouter.getCurrentState());
    });

    test("test try converter pathname variable resolver", () => {

        logger.debug("goodsDetailById==>", tryConverterPathnameVariableResolver("goodsDetailById"));
        logger.debug("userById==>", tryConverterPathnameVariableResolver("userById"));
        logger.debug("simpleBName==>", tryConverterPathnameVariableResolver("simpleBName"));
    });

    test("test none query params", async () => {
        const navigatorAdapter: NavigatorAdapter = new DefaultWrapperNavigatorAdapter(mockNavigatorAdapter, mockNavigatorContextAdapter);
        await navigatorAdapter.push("/test")
    })

    test("test query string array", () => {
        logger.debug("goodsDetailById==>", stringify({
            ids: [1]
        }, {
            arrayFormat: "index"
        }));
    })

});
