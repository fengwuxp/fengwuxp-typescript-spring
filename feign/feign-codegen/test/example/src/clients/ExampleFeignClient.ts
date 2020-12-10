/* tslint:disable */
import {AuthenticationType, Feign, FeignRequestOptions, GetMapping, PostMapping} from "fengwuxp-typescript-feign";
import {ExampleInfo} from "../model/info/ExampleInfo";
import {ExampleReq} from "../model/req/ExampleReq";

/**
* 
**/
    @Feign({ value: '/example', })
class ExampleFeignClient{

        /**
        * 查询测试
        **/
        @GetMapping({ value: '/query_example',authenticationType: AuthenticationType.TRY, })
    queryExample:(req?: undefined | null, option?: FeignRequestOptions) => Promise<ExampleInfo>;

        /**
        * post测试
        **/
        @PostMapping({ value: '/post_example',authenticationType: AuthenticationType.TRY, })
    postExample:(req: ExampleReq, option?: FeignRequestOptions) => Promise<void>;

}

export default new ExampleFeignClient()