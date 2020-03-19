import {
  BrowserNavigatorAdapter,
  BrowserNavigatorContextAdapter,
} from 'fengwuxp-browser-router'
import {
  AppRouterMapping,
  NavigatorDescriptorObject,
  RouteConfirmBeforeJumping,
  RouterCommandMethod,
  RouteMapping,
} from 'fengwuxp-declarative-router-adapter'
import {LoginViewProps} from '@/pages/user/LoginView';
import history from '@/pages/.umi/history'
import {MethodNameCommandResolver} from 'fengwuxp-declarative-command';
import SpringUmiAppRouter from "../.spring/SpringUmiAppRouter";
import UmiBrowserNavigatorAdapter from "@/UmiBrowserNavigatorAdapter";


// 判断是否需要登录
const routeConfirmBeforeJumping: RouteConfirmBeforeJumping = (nextNavigator: NavigatorDescriptorObject) => true;


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
  navigatorAdapter: () => new UmiBrowserNavigatorAdapter(history),
  methodNameCommandResolver: () => upperCaseToLeftIncline,
  pathPrefix: '/',
})
class AntdAppRouter extends SpringUmiAppRouter {

  @RouteMapping('/user/login')
  login: RouterCommandMethod<LoginViewProps>;

}

export default new AntdAppRouter();
