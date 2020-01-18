import {
  AbstractTarojsCommandRouter,
} from 'fengwuxp-tarojs-router'
import {
  AppCommandRouter,
  RouteMapping,
  RouterCommandMethod
} from 'fengwuxp-declarative-router-adapter'
import {MemberViewProps} from "./pages/member/MemberView";


export interface AppRouterInterface extends AppCommandRouter {

  /**
   * 跳转到首页
   */
  index: RouterCommandMethod

  member: RouterCommandMethod<MemberViewProps>


}


class TraoJsAppRouter extends AbstractTarojsCommandRouter implements AppRouterInterface {

  @RouteMapping("index/index")
  index: RouterCommandMethod;

  @RouteMapping("member/MemberView")
  member: RouterCommandMethod;
}

export const AppRouter = new TraoJsAppRouter();
