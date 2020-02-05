import {Feign, FeignRequestOptions, GetMapping, PostMapping} from 'fengwuxp-typescript-feign';
import {LoginReq} from "@/feign/user/req/LoginReq";


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
  login: (req: LoginReq, option?: FeignRequestOptions) => Promise<any>;


  @GetMapping({
    value: '/mobile/{userType}',
  })
  getMobileCaptcha: (req: {
    mobilePhone: string,
    userType: string;
  }, option?: FeignRequestOptions) => Promise<any>;
}

export default new MockService();
