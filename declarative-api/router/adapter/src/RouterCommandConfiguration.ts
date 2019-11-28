import {MethodNameCommandResolver} from "fengwuxp-declarative-command";
import {NavigatorAdapter, NavigatorDescriptorObject, NavigatorJumpRouteFunction} from "./NavigatorAdapter";
import {NavigatorContextAdapter} from "./NavigatorContextAdapter";

/**
 * Confirm before route jump
 * @param object
 * @return  NavigatorJumpRouteFunction or boolean ,if return  true: jump next route, if return route function NavigatorJumpRouteFunction
 */
export type RouteConfirmBeforeJumping = <T extends NavigatorDescriptorObject = NavigatorDescriptorObject>(object: T) => true | NavigatorJumpRouteFunction

export interface RouterCommandConfiguration {

    methodNameCommandResolver: () => MethodNameCommandResolver;

    navigatorAdapter: () => NavigatorAdapter;

    navigatorContextAdapter: () => NavigatorContextAdapter;

    confirmBeforeJumping?: () => RouteConfirmBeforeJumping;

}
