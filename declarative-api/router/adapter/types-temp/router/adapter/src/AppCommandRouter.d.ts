import { RouterCommand } from "./RouterCommand";
import { NavigatorAdapter } from "./NavigatorAdapter";
/**
 * uri path variable
 */
declare type UriPathVariable = Array<boolean | string | number | Date>;
/**
 * query params type
 */
declare type QueryParamType = Record<string, boolean | number | string | Date | UriPathVariable>;
export declare type RouteUriVariable = boolean | number | string | UriPathVariable | QueryParamType;
/**
 * @param uriVariables
 * @param state
 * @param command
 */
export declare type RouterCommandMethod<T = RouteUriVariable, S = RouteUriVariable> = (uriVariables?: T, state?: S | RouterCommand, command?: RouterCommand) => Promise<void> | void;
/**
 * app command router
 */
export interface AppCommandRouter extends NavigatorAdapter {
}
export {};
