import {Feign, FeignRequestOptions, GetMapping, PostMapping} from 'fengwuxp-typescript-feign';
import {LoginReq} from "@/feign/user/req/LoginReq";
import {LoginUserInfo} from "@/feign/user/info/LoginUserInfo";


/**
 * 类：例子服务
 * */

@Feign({
  value: '/',
})
class MockService {

  @PostMapping({
    value: '/login',
  })
  login: (req: LoginReq, option?: FeignRequestOptions) => Promise<LoginUserInfo>;


  @PostMapping({
    value: '/logout',
  })
  logout: (req?, option?: FeignRequestOptions) => Promise<void>;

  @PostMapping({
    value: '/oak_user/refresh_token',
  })
  refreshToken: (req?, option?: FeignRequestOptions) => Promise<LoginUserInfo>;

  @GetMapping({
    value: '/mobile/{userType}',
  })
  getMobileCaptcha: (req: {
    mobilePhone: string,
    userType: string;
  }, option?: FeignRequestOptions) => Promise<any>;
}

export default new MockService();
