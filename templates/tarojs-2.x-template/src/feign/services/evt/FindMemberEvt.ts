import {ApiReq} from "oak_common";

/**
 * 类：查询用户
 **/

export interface FindMemberEvt extends ApiReq {

    /**
     *属性说明：用户id
     *在java中的类型为：Long
     **/
    id?: number;
}
