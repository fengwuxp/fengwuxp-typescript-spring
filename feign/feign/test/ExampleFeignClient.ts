import {
    DeleteMapping,
    Feign,
    FeignRequestOptions,
    FeignRetry,
    HttpMediaType,
    HttpMethod,
    PostMapping,
    RequestMapping,
    Signature
} from "../src";
import {GetMapping} from "../src/annotations/mapping/GetMapping";
import {ValidateSchema} from '../src/annotations/validator/VailidatorSchema';


type FindMemberRequest = {
    name: string,
    userName: string,
    memberId: number,
    time: Date
};

@Feign({
    value: "/test",
    // url:"http://a.bc.cn/api",
})
export default class ExampleFeignClient {


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
    @ValidateSchema<FindMemberRequest>({
        memberId: {
            required: true,
            min: 1
        }
    })
    findMember: (
        request: FindMemberRequest,
        options?: FeignRequestOptions) => Promise<any>;

    @Signature({fields: ["memberId"]})
    @DeleteMapping({value: "delete_member/{memberId}", produces: [HttpMediaType.APPLICATION_JSON_UTF8]})
    deleteMember: (
        request: {
            memberId: number,
        },
        options?: FeignRequestOptions) => Promise<number>;
}

