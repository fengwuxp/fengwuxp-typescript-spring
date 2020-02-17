import {RouteContext} from 'fengwuxp-routing-core';
import {LoginUserInfo} from "@/feign/user/info/LoginUserInfo";


export interface AntdRouteContext extends RouteContext {

  loginUser: LoginUserInfo;
}
