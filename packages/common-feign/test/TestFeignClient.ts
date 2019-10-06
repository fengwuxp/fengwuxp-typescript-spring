import {Feign} from "../src/annotations/Feign";
import {RequestMapping} from "../src/annotations/mapping/RequestMapping";
import {GetMapping} from "../src/annotations/mapping/GetMapping";
import {PostMapping} from "../src/annotations/mapping/PostMapping";
import {Signature} from "../src/annotations/security/Signature";
import {FeignRetry} from "../src/annotations/retry/FeignRetry";
import {HttpMethod} from "../src/constant/HttpMethod";
import {FeignRequestOptions} from "../src/FeignRequestOptions";
import {DeleteMapping} from "../src/annotations/mapping/DeleteMapping";
import {MockFeignConfiguration} from "../src/configuration/MockFeignConfiguration";


@Feign({
    value: "/test",
    // url:"http://a.bc.cn/api",
    configuration: [new MockFeignConfiguration("http://test.ab.com/api/")]
})
export default class TestFeignClient {


    @GetMapping({
        value: "/example"
    })
    getExample: (request: {
        id: number,
        test: string,
        date: Date
    }, options: FeignRequestOptions) => Promise<any>;

    @Signature({fields: []})
    @RequestMapping({
        value: "//testQuery",
        method: HttpMethod.POST,
        headers: {}
    })
    @FeignRetry({
        retries: 5,
        maxTimeout: 25 * 1000
    })
    testQuery: (evt: any, options?: FeignRequestOptions) => Promise<any>;

    @Signature({fields: ["userName"]})
    @PostMapping({
        value: "find_member/{name}",
        headers: {myHeader: "tk_{memberId}"}
    })
    findMember: (
        request: {
            name: string,
            userName: string,
            memberId: number,
        },
        options?: FeignRequestOptions) => Promise<any>;

    @Signature({fields: ["memberId"]})
    @DeleteMapping({value: "delete_member/{memberId}"})
    deleteMember: (
        request: {
            memberId: number,
        },
        options?: FeignRequestOptions) => Promise<number>;
}
