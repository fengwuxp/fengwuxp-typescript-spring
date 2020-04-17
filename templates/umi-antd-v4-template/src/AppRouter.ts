import {
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
import {MethodNameCommandResolver} from 'fengwuxp-declarative-command';
import SpringUmiAppRouter from "../.spring/SpringUmiAppRouter";
// @ts-ignore
import {history} from "@@/core/history";
import UmiBrowserNavigatorAdapter from "@/UmiBrowserNavigatorAdapter";


// 判断是否需要登录
const routeConfirmBeforeJumping: RouteConfirmBeforeJumping = (nextNavigator: NavigatorDescriptorObject) => true;


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
