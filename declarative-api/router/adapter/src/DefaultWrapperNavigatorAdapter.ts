import {
    NavigatorAdapter,
    NavigatorDescriptorObject,
    NavigatorJumpRouteFunction,
} from "./NavigatorAdapter";
import {replaceUriVariableValue} from "./PathnameMethodNameCommandResolver";
import {stringify, parse} from "querystring";
import {RouteConfirmBeforeJumping} from "./RouterCommandConfiguration";
import {RouterCommand} from "./RouterCommand";
import {RouteUriVariable} from "./AppCommandRouter";

const grabUrlPathVariableRegExp = /\{(.+?)\}/g;

/**
 * wrapper navigator
 */
export default class DefaultWrapperNavigatorAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> implements NavigatorAdapter<T> {


    private navigatorAdapter: NavigatorAdapter<T>;

    private confirmBeforeJumping: RouteConfirmBeforeJumping;

    private pathPrefix: string;

    /**
     * 自动拼接查询参数
     */
    private autoJoinQueryString: boolean;


    constructor(navigatorAdapter: NavigatorAdapter<T>,
                confirmBeforeJumping: RouteConfirmBeforeJumping = () => true,
                pathPrefix: string = "/",
                autoJoinQueryString?: boolean) {
        this.navigatorAdapter = navigatorAdapter;
        this.confirmBeforeJumping = confirmBeforeJumping;
        this.pathPrefix = pathPrefix;
        this.autoJoinQueryString = autoJoinQueryString || true;
    }

    goBack = (num?: number, ...args) => {
        return this.navigatorAdapter.goBack(num, ...args);
    };

    popToTop = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.POP_TO_TOP, this.resolveUriVariables(object, uriVariables, state));
    };

    push = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.PUSH, this.resolveUriVariables(object, uriVariables, state));
    };

    toView = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.PUSH, this.resolveUriVariables(object, uriVariables, state));
    };

    reLaunch = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.RESET, this.resolveUriVariables(object, uriVariables, state));
    };

    replace = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.REPLACE, this.resolveUriVariables(object, uriVariables, state));
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


    private resolveUriVariables = (navigatorDescriptorObject: NavigatorDescriptorObject | string,
                                   _uriVariables: RouteUriVariable,
                                   _state: RouteUriVariable) => {

        if (typeof navigatorDescriptorObject === "string") {
            navigatorDescriptorObject = {
                pathname: navigatorDescriptorObject,
                uriVariables: _uriVariables,
                state: _state
            };
        }

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
            if (!this.autoJoinQueryString) {
                return navigatorObject
            }
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
