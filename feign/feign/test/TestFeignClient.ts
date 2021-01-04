import {
    AuthenticationType,
    DeleteMapping,
    Feign,
    FeignRequestOptions,
    FeignRetry,
    FileUpload,
    HttpMediaType,
    HttpMethod,
    PostMapping,
    PutMapping,
    RequestMapping,
    Signature
} from "../src";
import {GetMapping} from "../src/annotations/mapping/GetMapping";
import {ValidateSchema} from '../src/annotations/validator/VailidatorSchema';


type FindMemberRequest = {
    name: string,
    userName: string,
    memberId: number,
};

@Feign({
    value: "/test",
    // url:"http://a.bc.cn/api",
    // configuration: MockFeignConfiguration
})
export default class TestFeignClient {


    @GetMapping({
        // value: "/example"
        authenticationType: AuthenticationType.TRY
    })
    getExample: (request: {
        id: number,
        test: string,
        date: Date
    }, options?: FeignRequestOptions) => Promise<any>;

    @Signature({fields: []})
    @RequestMapping({
        value: "/testQuery",
        method: HttpMethod.POST,
        headers: {
            test: 1,
            test2: [2, 3],
            test3: false
        },
        params: ["a=2"]
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
        params: {
            a: 2,
            c: ["2", 3],
            h: false
        },
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

    @FileUpload<{
        goods: Array<string>
    }>({
        fields: ["goods"]
    })
    @PostMapping({
        value: "evaluate/order",
        produces: [HttpMediaType.APPLICATION_JSON_UTF8]
    })
    evaluateOrder: (req: {
        goods: Array<string>
    }) => Promise<void>;


    @DeleteMapping({value: "/deleted"})
    deleteById: (req: { ids: number[]; a: string; c: string }) => Promise<void>;

    @PutMapping({value: "/put_data_test", produces: [HttpMediaType.APPLICATION_JSON_UTF8]})
    putDataTest: (req: { name: string; age: number }) => Promise<void>;
}
