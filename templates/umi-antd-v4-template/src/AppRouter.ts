import {
  BrowserNavigatorAdapter,
  BrowserNavigatorContextAdapter,
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
import {LoginViewProps} from '@/pages/user/LoginView';
import history from '@/pages/.umi/history'
import {MethodNameCommandResolver} from 'fengwuxp-declarative-command';
// import {CreateDemoViewProps} from '@/pages/demo/CreateDemoView';
// import {DemoListViewProps} from '@/pages/demo/DemoListView';


export interface AppRouterInterface extends AppCommandRouter {


  login: RouterCommandMethod<LoginViewProps>;

  demoListView: RouterCommandMethod;

  demoCreateView: RouterCommandMethod;
}
// 判断是否需要登录
const routeConfirmBeforeJumping: RouteConfirmBeforeJumping = (nextNavigator: NavigatorDescriptorObject) => true


// @ts-ignore
// const history = window.g_history;

/**
 * 将大写字母转换成 "/"
 * example : 'memberIndexView' ==>  member/IndexView'
 * @param methodName
 */
export const upperCaseToLeftIncline: MethodNameCommandResolver = (methodName: string) => methodName.replace('View', '')
  .replace(/([A-Z])/g, '/$1').toLowerCase();


@AppRouterMapping({
  confirmBeforeJumping: () => routeConfirmBeforeJumping,
  navigatorContextAdapter: () => new BrowserNavigatorContextAdapter(),
  navigatorAdapter: () => new BrowserNavigatorAdapter(history),
  methodNameCommandResolver: () => upperCaseToLeftIncline,
  pathPrefix: '/',
})
class AntdAppRouter extends AbstractAppCommandRouter implements AppRouterInterface {

  @RouteMapping('/user/login')
  login: RouterCommandMethod<LoginViewProps>;

  // @RouteMapping("/demo/list")
  demoListView: RouterCommandMethod;

  // @RouteMapping("/demo/create")
  demoCreateView: RouterCommandMethod;
}

export default new AntdAppRouter();
