import {
  BrowserNavigatorAdapter,
  BrowserNavigatorContextAdapter
} from 'fengwuxp-browser-router'
import {
  AppRouterMapping,
  AppCommandRouter,
  NavigatorDescriptorObject,
  RouteConfirmBeforeJumping,
  RouterCommandMethod,
  RouteMapping,
  AbstractAppCommandRouter
} from 'fengwuxp-declarative-router-adapter'
import {LoginViewProps} from "@/pages/user/LoginView";
import history from "@/pages/.umi/history"

export interface AppRouterInterface extends AppCommandRouter {


  login: RouterCommandMethod<LoginViewProps>;
}

const routeConfirmBeforeJumping: RouteConfirmBeforeJumping = (nextNavigator: NavigatorDescriptorObject) => {

  // 判断是否需要登录

  return true
};


// @ts-ignore
// const history = window.g_history;

@AppRouterMapping({
  confirmBeforeJumping: () => routeConfirmBeforeJumping,
  navigatorContextAdapter: () => new BrowserNavigatorContextAdapter(),
  navigatorAdapter: () => new BrowserNavigatorAdapter(history),
  pathPrefix: "/"
})
class AntdAppRouter extends AbstractAppCommandRouter implements AppRouterInterface {

  @RouteMapping("/user/login")
  login: RouterCommandMethod<LoginViewProps>;

}


export const AppRouter = new AntdAppRouter();
