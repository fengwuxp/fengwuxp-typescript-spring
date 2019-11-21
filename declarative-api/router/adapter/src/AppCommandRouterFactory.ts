import {AppCommandRouter, RouteUriVariable} from "./AppCommandRouter";
import {newProxyInstanceEnhance} from "fengwuxp-common-proxy";
import {NavigatorAdapter} from "./NavigatorAdapter";
import {RouterCommand} from "./RouterCommand";
import {RouterCommandConfiguration} from "./RouterCommandConfiguration";

// export type RouterCommandDispatcher = (methodName:string) => Promise<void> | void;


/**
 * app command router factory
 *
 * @param configuration
 */
export const appCommandRouterFactory = <T extends AppCommandRouter,
    N extends NavigatorAdapter = NavigatorAdapter>(configuration: RouterCommandConfiguration): T & N => {


    const methodNameCommandResolver = configuration.methodNameCommandResolver();
    const navigator: N = configuration.navigatorAdapter<N>();

    return newProxyInstanceEnhance<T & N>(navigator as any, null,
        (object, propertyKey: string, receiver) => {

            return function (uriVariables?: RouteUriVariable, state?: RouteUriVariable | RouterCommand, command?: RouterCommand): Promise<any> | void {

                const commandValue = methodNameCommandResolver(propertyKey);
                let pathname: string;
                if (Array.isArray(commandValue)) {
                    command = parseInt(commandValue[0]);
                    pathname = commandValue[1];
                } else {
                    command = command || RouterCommand.PUSH;
                    pathname = commandValue;
                }

                const navigatorDescriptorObject = {
                    pathname,
                    state: typeof state === "number" ? undefined : state,
                    uriVariables
                };
                switch (command) {
                    case RouterCommand.POP:
                        return navigator.goBack();
                    case RouterCommand.PUSH:
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
