import {
    Feign,
    FeignRequestOptions,
    GetMapping,
    HttpMediaType,
    PostMapping,
    PutMapping
} from "fengwuxp-typescript-feign";

import {CreateExampleEntityReq} from "../../services/simple/req/CreateExampleEntityReq";
import {EditExampleEntityReq} from "../../services/simple/req/EditExampleEntityReq";
import {DeleteExampleEntityReq} from "../../services/simple/req/DeleteExampleEntityReq";
import {QueryExampleEntityReq} from "../../services/simple/req/QueryExampleEntityReq";
import {PageInfo} from "oak-common";
import {ExampleEntityInfo} from "../../services/simple/info/ExampleEntityInfo";
import {ExampleServiceDetailReq} from "../../req/ExampleServiceDetailReq";

/**
 * 接口：POST
 **/

@Feign({
    value: '/v1/example',
})
class ExampleService {

    /**
     * 1:接口方法：POST
     * 2:描述的文字
     * 3:返回值在java中的类型为：ApiResp
     * 4:返回值在java中的类型为：Long
     **/
    @PostMapping({
        value: '/create',
        produces: [HttpMediaType.FORM_DATA],
    })
    create: (req: CreateExampleEntityReq, option?: FeignRequestOptions) => Promise<number>;
    /**
     * 1:接口方法：PUT
     * 2:描述的文字
     * 3:返回值在java中的类型为：ApiResp
     * 4:返回值在java中的类型为：Void
     **/
    @PutMapping({
        value: '/edit',
        produces: [HttpMediaType.FORM_DATA],
    })
    edit: (req: EditExampleEntityReq, option?: FeignRequestOptions) => Promise<void>;
    /**
     * 1:接口方法：GET
     * 2:描述的文字
     * 3:返回值在java中的类型为：ApiResp
     * 4:返回值在java中的类型为：Void
     **/
    @GetMapping({
        value: '/delete',
        produces: [HttpMediaType.FORM_DATA],
    })
    delete: (req: DeleteExampleEntityReq, option?: FeignRequestOptions) => Promise<void>;
    /**
     * 1:接口方法：GET
     * 2:描述的文字
     * 3:返回值在java中的类型为：ApiResp
     * 4:返回值在java中的类型为：Pagination
     * 5:返回值在java中的类型为：ExampleEntityInfo
     **/
    @GetMapping({
        value: '/query',
        produces: [HttpMediaType.FORM_DATA],
    })
    query: (req: QueryExampleEntityReq, option?: FeignRequestOptions) => Promise<PageInfo<ExampleEntityInfo>>;
    /**
     * 1:接口方法：GET
     * 2:描述的文字
     * 3:返回值在java中的类型为：ApiResp
     * 4:返回值在java中的类型为：ExampleEntityInfo
     **/
    @GetMapping({
        value: '/{id}',
        produces: [HttpMediaType.FORM_DATA],
    })
    detail: (req: ExampleServiceDetailReq, option?: FeignRequestOptions) => Promise<ExampleEntityInfo>;
}

export default new ExampleService();
