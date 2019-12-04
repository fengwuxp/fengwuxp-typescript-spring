import {Feign, HttpMediaType} from "../src";
import {RequestMapping} from "../src";
import {GetMapping} from "../src/annotations/mapping/GetMapping";
import {PostMapping} from "../src";
import {Signature} from "../src";
import {FeignRetry} from "../src";
import {HttpMethod} from "../src";
import {FeignRequestOptions} from "../src";
import {DeleteMapping} from "../src";
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
    }, options?: FeignRequestOptions) => Promise<any>;

    @Signature({fields: []})
    @RequestMapping({
        value: "//testQuery",
        method: HttpMethod.POST,
        headers: {}
    })
    @FeignRetry({
        retries: 5,
        delay: 2000,
        maxTimeout: 9 * 1000
    })
    testQuery: (evt: any, options?: FeignRequestOptions) => Promise<any>;

    @Signature({fields: ["userName"]})
    @PostMapping({
        value: "find_member/{name}",
        headers: {myHeader: "tk_{memberId}"},
        produces: [HttpMediaType.APPLICATION_JSON_UTF8]
    })
    findMember: (
        request: {
            name: string,
            userName: string,
            memberId: number,
        },
        options?: FeignRequestOptions) => Promise<any>;

    @Signature({fields: ["memberId"]})
    @DeleteMapping({value: "delete_member/{memberId}", produces: [HttpMediaType.APPLICATION_JSON_UTF8]})
    deleteMember: (
        request: {
            memberId: number,
        },
        options?: FeignRequestOptions) => Promise<number>;
}
