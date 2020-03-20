import {
    AbstractTarojsCommandRouter,
} from 'fengwuxp-tarojs-router'
import {
    AppCommandRouter,
    RouteMapping,
    RouterCommandMethod
} from 'fengwuxp-declarative-router-adapter'
import {MemberViewProps} from "./pages/member/MemberView";
import {CharF2Props} from "@src/pages/charsf2";


export interface AppRouterInterface extends AppCommandRouter {

    /**
     * 跳转到首页
     */
    index: RouterCommandMethod

    member: RouterCommandMethod<MemberViewProps>

    charsF2: RouterCommandMethod<CharF2Props>

}


class TraoJsAppRouter extends AbstractTarojsCommandRouter implements AppRouterInterface {

    @RouteMapping("index/index")
    index: RouterCommandMethod;

    @RouteMapping("member/MemberView")
    member: RouterCommandMethod<MemberViewProps>;

    @RouteMapping("charsf2/index")
    charsF2: RouterCommandMethod<CharF2Props>;
}


export const AppRouter = new TraoJsAppRouter();

