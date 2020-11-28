/* tslint:disable */
import {
Feign,
RequestMapping,
PostMapping,
DeleteMapping,
GetMapping,
PutMapping,
Signature,
HttpMediaType,
AuthenticationType,
FeignRequestOptions} from "fengwuxp-typescript-feign";
    import { QueryExampleReq } from "QueryExampleReq";

/**
* 
**/
class ExampleFeignClient{

        /**
        * 查询测试
        **/
        @GetMapping({ value: '/query_example',method: HttpMethod.GET,authenticationType: AuthenticationType.TRY, })
    queryExample:(req?: undefined | null, option?: FeignRequestOptions) => Promise<number>;

        /**
        * post测试
        **/
        @PostMapping({ value: '/post_example',method: HttpMethod.POST,authenticationType: AuthenticationType.TRY, })
    postExample:(req: QueryExampleReq, option?: FeignRequestOptions) => Promise<void>;

}

export default new ExampleFeignClient()