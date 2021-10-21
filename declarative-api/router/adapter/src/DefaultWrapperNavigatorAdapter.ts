import {NavigatorAdapter, NavigatorDescriptorObject,} from "./NavigatorAdapter";
import {replaceUriVariableValue} from "./PathnameMethodNameCommandResolver";
import {parse, stringify} from "querystring";
import {RouteConfirmBeforeJumping} from "./RouterCommandConfiguration";
import {RouterCommand} from "./RouterCommand";
import {RouteUriVariable} from "./AppCommandRouter";
import {NavigatorContextAdapter} from "./NavigatorContextAdapter";


const grabUrlPathVariableRegExp = /\{(.+?)\}/g;

const VIEW_JUMP_CONTEXT_ID = '__VIEW_JUMP_CONTEXT__';

/**
 * wrapper navigator
 */
export default class DefaultWrapperNavigatorAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject>
    implements NavigatorAdapter<T>, NavigatorContextAdapter<T> {


    private readonly navigatorAdapter: NavigatorAdapter<T>;

    private readonly navigatorContextAdapter: NavigatorContextAdapter<T>;

    private readonly confirmBeforeJumping: RouteConfirmBeforeJumping;

    // 路径前缀 web context path
    private readonly pathPrefix: string;

    /**
     * 自动拼接查询参数
     */
    private readonly autoJoinQueryString: boolean;


    constructor(navigatorAdapter: NavigatorAdapter<T>,
                navigatorContextAdapter: NavigatorContextAdapter<T>,
                confirmBeforeJumping: RouteConfirmBeforeJumping = () => true,
                pathPrefix: string = "/",
                autoJoinQueryString: boolean = true) {
        this.navigatorAdapter = navigatorAdapter;
        this.navigatorContextAdapter = navigatorContextAdapter;
        this.confirmBeforeJumping = confirmBeforeJumping;
        this.pathPrefix = pathPrefix;
        this.autoJoinQueryString = autoJoinQueryString;
    }

    goBack = (num?: number, ...args) => {
        return this.navigatorAdapter.goBack(num, ...args);
    };

    popToTop = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.POP_TO_TOP, object, uriVariables, state);
    };

    push = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.PUSH, object, uriVariables, state);
    };

    toView = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.PUSH, object, uriVariables, state);
    };

    popAndPush = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.POP_TO_TOP, object, uriVariables, state);
    };

    reLaunch = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.RESET, object, uriVariables, state);
    };

    replace = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.REPLACE, object, uriVariables, state);
    };

    switchTab = (object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {
        return this.jump(RouterCommand.SWITCH_TAB, object, uriVariables, state);
    };

    getBrowseHistory = () => this.navigatorContextAdapter.getBrowseHistory();

    getCurrentObject = () => this.navigatorContextAdapter.getCurrentObject();

    getCurrentPathname = () => this.navigatorContextAdapter.getCurrentPathname();

    getCurrentState = <S = RouteUriVariable>() => this.navigatorContextAdapter.getCurrentState<S>();

    getCurrentUriVariables = <S = RouteUriVariable>() => this.navigatorContextAdapter.getCurrentUriVariables<S>();

    isStackTop = () => this.navigatorContextAdapter.isStackTop();

    isView = (pathname: string) => {
        const _pathname = pathname.startsWith(this.pathPrefix) ? pathname : `${this.pathPrefix}${pathname}`;
        return this.navigatorContextAdapter.isView(_pathname);
    };


    /**
     * 页面跳转
     * @param routerCommand
     * @param object
     * @param uriVariables
     * @param state
     */
    private jump = async (routerCommand: RouterCommand, object, uriVariables?: RouteUriVariable, state?: RouteUriVariable) => {

        if (typeof object === "string") {
            object = {
                pathname: object,
                uriVariables,
                state
            };
        }

        const navigatorDescriptorObject = this.resolveUriVariables(object, uriVariables, state);

        const pathname = navigatorDescriptorObject.pathname;
        if (!pathname.startsWith(this.pathPrefix)) {
            navigatorDescriptorObject.pathname = `${this.pathPrefix}${pathname}`
        }
        let reentryTimes = 0;
        if (navigatorDescriptorObject[VIEW_JUMP_CONTEXT_ID] != null) {
            reentryTimes = ++navigatorDescriptorObject[VIEW_JUMP_CONTEXT_ID].reentryTimes;
        }
        if (reentryTimes < 1) {
            const confirmResult = this.confirmBeforeJumping(navigatorDescriptorObject);
            if (confirmResult === true) {
                return (this.navigatorAdapter[routerCommand] as any)(navigatorDescriptorObject);
            } else if (typeof confirmResult === "function") {
                if (navigatorDescriptorObject[VIEW_JUMP_CONTEXT_ID] == null) {
                    navigatorDescriptorObject[VIEW_JUMP_CONTEXT_ID] = {
                        reentryTimes: 0
                    }
                }
                return confirmResult(navigatorDescriptorObject);
            } else {
                throw new Error("confirm before is not support");
            }
        } else {
            delete navigatorDescriptorObject[VIEW_JUMP_CONTEXT_ID];
            return (this.navigatorAdapter[routerCommand] as any)(navigatorDescriptorObject);
        }


    };


    /**
     * 解析uri 路径参数
     * @param navigatorDescriptorObject
     * @param _uriVariables
     * @param _state
     */
    private resolveUriVariables = (navigatorDescriptorObject: NavigatorDescriptorObject,
                                   _uriVariables: RouteUriVariable,
                                   _state: RouteUriVariable) => {

        const navigatorObject = this.tryHandlePathArguments(navigatorDescriptorObject);
        let {pathname, uriVariables} = navigatorObject;
        const [path, queryString] = pathname.split("?");

        uriVariables = {
            ...(uriVariables as object),
            ...parse(queryString)
        };
        if (Object.keys(uriVariables).length === 0) {
            return navigatorObject;
        }
        if (this.autoJoinQueryString) {
            return {
                ...navigatorObject,
                pathname: `${path}?${stringify(uriVariables as any)}`
            }
        }
        navigatorObject.uriVariables = uriVariables;
        navigatorObject.pathname = path;
        navigatorObject.search = `?${stringify(uriVariables as any)}`;
        return navigatorObject
    };

    /**
     * 尝试处理路径参数
     * @param navigatorDescriptorObject
     */
    private tryHandlePathArguments = (navigatorDescriptorObject: NavigatorDescriptorObject) => {
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

    getNavigatorAdapter = () => this.navigatorAdapter;

    getNavigatorContextAdapter = () => this.navigatorContextAdapter;

}
