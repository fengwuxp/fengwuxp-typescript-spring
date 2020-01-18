import {
Feign,
RequestMapping,
PostMapping,
DeleteMapping,
GetMapping,
PutMapping,
Signature,
HttpMediaType,
FeignRequestOptions} from "fengwuxp-typescript-feign";

        import {QueryMemberEvt} from "./evt/QueryMemberEvt";
        import {FindMemberEvt} from "./evt/FindMemberEvt";
        import {CreateMemberEvt} from "./evt/CreateMemberEvt";
        import {PageInfo} from "oak_common";
        import {MemberInfo} from "./info/MemberInfo";

    /**
        * 类：例子服务
    **/

    @Feign({
    })
class ExampleService{

    /**
        * 1:方法：查询用户
        * 2:返回值在java中的类型为：ServiceQueryResp
        * 3:返回值在java中的类型为：MemberInfo
    **/
        @PostMapping({
        })
    queryMember:(req: QueryMemberEvt, option?: FeignRequestOptions) => Promise<PageInfo<MemberInfo>>;
    /**
        * 1:方法：查询用户
        * 2:返回值在java中的类型为：ServiceResp
        * 3:返回值在java中的类型为：MemberInfo
    **/
        @PostMapping({
        })
        @Signature({
            fields:["id"],
        })
    findMember:(req: FindMemberEvt, option?: FeignRequestOptions) => Promise<MemberInfo>;
    /**
        * 1:方法：查询用户
        * 2:返回值在java中的类型为：ServiceResp
        * 3:返回值在java中的类型为：Long
    **/
        @PostMapping({
        })
        @Signature({
            fields:["name","sex"],
        })
    createMember:(req: CreateMemberEvt, option?: FeignRequestOptions) => Promise<number>;
    /**
        * 1:方法：simple
        * 2:返回值在java中的类型为：ServiceResp
        * 3:返回值在java中的类型为：Map
        * 4:返回值在java中的类型为：String
        * 5:返回值在java中的类型为：MemberInfo
    **/
        @PostMapping({
        })
        @Signature({
            fields:["name","sex"],
        })
    simple:(req: CreateMemberEvt, option?: FeignRequestOptions) => Promise<Record<string,MemberInfo>>;
    /**
        * 1:方法：simple2
        * 2:返回值在java中的类型为：ServiceQueryResp
        * 3:返回值在java中的类型为：Map
        * 4:返回值在java中的类型为：String
        * 5:返回值在java中的类型为：MemberInfo
    **/
        @PostMapping({
        })
        @Signature({
            fields:["name","sex"],
        })
    simple2:(req: CreateMemberEvt, option?: FeignRequestOptions) => Promise<PageInfo<Record<string,MemberInfo>>>;
}

export default new ExampleService();
