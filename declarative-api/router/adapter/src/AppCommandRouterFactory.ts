import {AppCommandRouter, RouteUriVariable} from "./AppCommandRouter";
import {newProxyInstanceEnhance} from "fengwuxp-common-proxy";
import {NavigatorAdapter} from "./NavigatorAdapter";
import {RouterCommand} from "./RouterCommand";
import {RouterCommandConfiguration} from "./RouterCommandConfiguration";
import {
    tryConverterPathnameVariableResolver
} from "./PathnameMethodNameCommandResolver";
import DefaultWrapperNavigatorAdapter from "./DefaultWrapperNavigatorAdapter";
// import {tryConverterMethodNameCommandResolver} from "../../../declarative-command/src";
import {tryConverterMethodNameCommandResolver} from "fengwuxp-declarative-command";


const ROUTE_COMMAND_VALUES = Object.keys(RouterCommand).map((key) => {
    return RouterCommand[key]
});

/**
 * app command router factory
 *
 * @param configuration
 * @param pathPrefix   automatically supplemented prefix
 */
export const appCommandRouterFactory = <T extends AppCommandRouter,
    N extends NavigatorAdapter = NavigatorAdapter>(configuration: RouterCommandConfiguration, pathPrefix?: string): T & N => {


    const methodNameCommandResolver = configuration.methodNameCommandResolver();
    const confirmBeforeJumping = typeof configuration.confirmBeforeJumping === "function" ? configuration.confirmBeforeJumping() : undefined;
    const navigator = new DefaultWrapperNavigatorAdapter(configuration.navigatorAdapter(), confirmBeforeJumping, pathPrefix);

    return newProxyInstanceEnhance<T & N>(navigator as any, null,
        (object, propertyKey: string, receiver) => {

            return function (uriVariables?: RouteUriVariable, state?: RouteUriVariable | RouterCommand, routerCommand?: RouterCommand): Promise<any> | void {

                //尝试从方法名称中解析到 指令
                let [command, pathname] = tryConverterMethodNameCommandResolver(propertyKey, ROUTE_COMMAND_VALUES, RouterCommand.PUSH);
                pathname = pathname.replace(pathname[0], pathname[0].toLocaleLowerCase());
                //尝试解析路径参数
                pathname = methodNameCommandResolver(tryConverterPathnameVariableResolver(pathname));

                if (ROUTE_COMMAND_VALUES.indexOf(state) >= 0) {
                    command = state as RouterCommand;
                    state = undefined;
                }
                command = routerCommand || command;
                const navigatorDescriptorObject = {
                    pathname,
                    state,
                    uriVariables
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
                    default:
                        throw new Error(`not support command: ${command}`);
                }

            }
        });
};
