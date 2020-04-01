import {RouterCommand} from "./RouterCommand";
import {NavigatorAdapter, NavigatorDescriptorObject} from "./NavigatorAdapter";
import {NavigatorContextAdapter} from "./NavigatorContextAdapter";
import {AppRouterMappingConfiguration} from "./annotations/AppRouterMapping";


/**
 * uri path variable
 */
type UriPathVariable = Array<boolean | string | number | Date>;

/**
 * query params type
 */
type QueryParamType = Record<string, boolean | number | string | Date | UriPathVariable>;


export type RouteUriVariable = boolean | number | string | UriPathVariable | QueryParamType;


// export type RouterCommandMethod0 = () => Promise<void> | void;
// export type RouterCommandMethod1 = (uriVariables: RouteUriVariable) => Promise<void> | void;
// export type RouterCommandMethod2 = (uriVariables: RouteUriVariable, state: RouteUriVariable) => Promise<void> | void;
// export type RouterCommandMethod3 = (uriVariables: RouteUriVariable, state: RouterCommand) => Promise<void> | void;
//
// /**
//  * @param uriVariables
//  * @param state
//  * @param command
//  */
// export type RouterCommandMethod4 = (uriVariables?: RouteUriVariable, state?: RouteUriVariable, command?: RouterCommand) => Promise<void> | void;


/**
 * @param uriVariables
 * @param state
 * @param command
 */
export type RouterCommandMethod<T = RouteUriVariable, S = RouteUriVariable> = (uriVariables?: T, state?: S | RouterCommand, command?: RouterCommand) => Promise<void> | void;
// RouterCommandMethod0
// | RouterCommandMethod1
// | RouterCommandMethod2
// | RouterCommandMethod3
// | RouterCommandMethod3
// | RouterCommandMethod4;

/**
 * app command router
 */
export interface AppCommandRouter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject> extends NavigatorAdapter<T>, NavigatorContextAdapter<T> {

    new?(configuration?: AppRouterMappingConfiguration): AppCommandRouter

    getNavigatorAdapter: () => NavigatorAdapter;

    getNavigatorContextAdapter: () => NavigatorContextAdapter;


    /**
     *  key   ==> {@code pathname} route 路径
     *  value ==> command method
     *
     *  example :
     *    {
     *        login:()=>Promise<void>,
     *        index:()=>Promise<void>,
     *        goodsDetailById:()=>Promise<void>,
     *    }
     *
     *  or
     *
     *   {
     *
     *       pushLogin:()=>Promise<void>
     *       resetLogin:()=>Promise<void>
     *
     *   }
     */
    // [pathname: string]: RouterCommandMethod | any;


}
