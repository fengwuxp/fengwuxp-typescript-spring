import {NavigatorAdapter, NavigatorDescriptorObject} from "./NavigatorAdapter";
import {replaceUriVariableValue} from "./PathnameMethodNameCommandResolver";
import {stringify, parse} from "querystring";
import {RouteConfirmBeforeJumping} from "./RouterCommandConfiguration";
import {RouterCommand} from "./RouterCommand";

const grabUrlPathVariableRegExp = /\{(.+?)\}/g;

/**
 * wrapper navigator
 */
export default class DefaultWrapperNavigatorAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> implements NavigatorAdapter<T> {


    private navigatorAdapter: NavigatorAdapter;

    private confirmBeforeJumping: RouteConfirmBeforeJumping;

    private pathPrefix: string;


    constructor(navigatorAdapter: NavigatorAdapter<NavigatorDescriptorObject>,
                confirmBeforeJumping: RouteConfirmBeforeJumping = () => true,
                pathPrefix: string = "/") {
        this.navigatorAdapter = navigatorAdapter;
        this.confirmBeforeJumping = confirmBeforeJumping;
        this.pathPrefix = pathPrefix;
    }

    goBack = (num?: number, ...args) => {
        return this.navigatorAdapter.goBack(num, ...args);
    };

    popToTop = (navigatorDescriptorObject: NavigatorDescriptorObject) => {
        return this.jump(RouterCommand.POP_TO_TOP, this.resolveUriVariables(navigatorDescriptorObject));
    };


    push = (navigatorDescriptorObject: NavigatorDescriptorObject) => {
        return this.jump(RouterCommand.PUSH, this.resolveUriVariables(navigatorDescriptorObject));
    };

    reLaunch = (navigatorDescriptorObject: NavigatorDescriptorObject) => {
        return this.jump(RouterCommand.RESET, this.resolveUriVariables(navigatorDescriptorObject));
    };

    replace = (navigatorDescriptorObject: NavigatorDescriptorObject) => {
        return this.jump(RouterCommand.REPLACE, this.resolveUriVariables(navigatorDescriptorObject));
    };

    private jump = (fnName: keyof NavigatorAdapter, navigatorDescriptorObject: NavigatorDescriptorObject) => {

        const pathname = navigatorDescriptorObject.pathname;
        if (!pathname.startsWith(this.pathPrefix)) {
            navigatorDescriptorObject.pathname = `${this.pathPrefix}${pathname}`
        }
        const confirmResult = this.confirmBeforeJumping(navigatorDescriptorObject);
        if (confirmResult === true) {
            return (this.navigatorAdapter[fnName] as any)(navigatorDescriptorObject);
        } else if (typeof confirmResult === "function") {
            return confirmResult(navigatorDescriptorObject);
        } else {
            throw new Error("confirm before is not support");
        }

    };


    private resolveUriVariables = (navigatorDescriptorObject: NavigatorDescriptorObject) => {

        const navigatorObject = this.tryHandlePathArguments(navigatorDescriptorObject);
        let {pathname, uriVariables} = navigatorObject;
        const [, queryString] = pathname.split("?");

        //TODO 参数类型检查
        // if (Array.isArray(uriVariables)){}

        uriVariables = {
            ...(uriVariables as object),
            ...parse(queryString)
        };
        if (Object.keys(uriVariables).length === 0) {
            return navigatorObject;
        } else {
            return {
                ...navigatorObject,
                pathname: `${pathname}?${stringify(uriVariables)}`
            }
        }

    };

    /**
     * 尝试处理路径参数
     * @param navigatorDescriptorObject
     */
    private tryHandlePathArguments(navigatorDescriptorObject: NavigatorDescriptorObject) {
        const {pathname, uriVariables} = navigatorDescriptorObject;
        // 路径参数处理，存在路径参数
        if (grabUrlPathVariableRegExp.test(pathname)) {
            const isPrimitiveType = typeof uriVariables != "object";
            navigatorDescriptorObject.pathname = pathname.replace(grabUrlPathVariableRegExp, replaceUriVariableValue(uriVariables, isPrimitiveType));
            if (isPrimitiveType) {
                navigatorDescriptorObject.uriVariables = null;
            }

        }
        return navigatorDescriptorObject;
    }
}
