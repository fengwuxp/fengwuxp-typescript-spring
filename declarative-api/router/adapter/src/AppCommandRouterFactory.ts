import {AppCommandRouter, RouteUriVariable} from "./AppCommandRouter";
import {newProxyInstanceEnhance} from "fengwuxp-common-proxy";
import {RouterCommand} from "./RouterCommand";
import {RouterCommandConfiguration} from "./RouterCommandConfiguration";
import DefaultWrapperNavigatorAdapter from "./DefaultWrapperNavigatorAdapter";
import {tryConverterMethodNameCommandResolver} from "fengwuxp-declarative-command";


const ROUTE_COMMAND_VALUES = Object.keys(RouterCommand).map((key) => {
    return RouterCommand[key]
});

const initialLowercase = (str: string) => {
    return str.replace(str[0], str[0].toLocaleLowerCase());
};


/**
 * app command router factory
 *
 * @param configuration
 * @param pathPrefix   automatically supplemented prefix
 * @param autoJoinQueryString
 */
export const appCommandRouterFactory = <T extends AppCommandRouter>(configuration: RouterCommandConfiguration,
                                                                    pathPrefix?: string,
                                                                    autoJoinQueryString?: boolean): T => {

    const methodNameCommandResolver = configuration.methodNameCommandResolver();
    const confirmBeforeJumping = typeof configuration.confirmBeforeJumping === "function" ? configuration.confirmBeforeJumping() : undefined;
    const navigatorContextAdapter = configuration.navigatorContextAdapter();
    const navigator = new DefaultWrapperNavigatorAdapter(configuration.navigatorAdapter(), navigatorContextAdapter, confirmBeforeJumping, pathPrefix, autoJoinQueryString);

    return newProxyInstanceEnhance<T>(navigator as any, null,
        (target, propertyKey: string, receiver) => {

            // isXX 方法
            if (propertyKey.startsWith("is")) {
                if (propertyKey.endsWith("View")) {
                    return function () {
                        //判断是否处于某个视图
                        const path = methodNameCommandResolver(propertyKey.replace(/^is(\w+)View$/, ($1, $2) => {
                            return initialLowercase($2);
                        }));
                        return target.isView(path);
                    }
                }
            }

            return function (uriVariables?: RouteUriVariable, state?: RouteUriVariable | RouterCommand, routerCommand?: RouterCommand): Promise<any> | void {

                let [command, pathname] = [RouterCommand.PUSH as string, methodNameCommandResolver(propertyKey)];
                if (pathname === propertyKey) {
                    //尝试从方法名称中解析到 指令
                    const result = tryConverterMethodNameCommandResolver(propertyKey, ROUTE_COMMAND_VALUES, command);
                    command = result[0];
                    pathname = initialLowercase(result[1]);
                }

                if (ROUTE_COMMAND_VALUES.indexOf(state) >= 0) {
                    command = state as RouterCommand;
                    state = undefined;
                }

                command = routerCommand || command;
                const navigatorDescriptorObject = {
                    pathname,
                    state,
                    uriVariables,
                    // 上下文信息
                    // [VIEW_JUMP_CONTEXT_ID]: {
                    //     // 方法重入次数
                    //     count: 0,
                    //     // originalMethodName: propertyKey
                    // }
                };

                switch (command) {
                    case RouterCommand.POP:
                        return navigator.goBack();
                    case RouterCommand.PUSH:
                    case RouterCommand.TO:
                        return navigator.push(navigatorDescriptorObject);
                    case RouterCommand.REPLACE:
                        return navigator.replace(navigatorDescriptorObject);
                    case RouterCommand.RESET:
                        return navigator.reLaunch(navigatorDescriptorObject);
                    case RouterCommand.POP_TO_TOP:
                        return navigator.popToTop(navigatorDescriptorObject);
                    case RouterCommand.SWITCH_TAB:
                        return navigator.switchTab(navigatorDescriptorObject);
                    default:
                        throw new Error(`not support command: ${command}`);
                }

            }
        });
};
