import {
    DeleteMapping,
    Feign,
    FeignRequestOptions,
    FeignRetry,
    GetMapping,
    HttpMethod,
    PostMapping,
    RequestMapping,
    Signature
} from "fengwuxp-typescript-feign";


@Feign({
    value: "/test",
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
