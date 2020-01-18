import {ApiQueryReq} from "oak_common";
import {Sex} from "../../enums/Sex";

/**
 * 类：查询用户
 **/

export interface QueryMemberEvt extends ApiQueryReq {

    /**
     *属性说明：用户id
     *在java中的类型为：Long
     **/
    id?: number;
    /**
     *属性说明：用户名名称
     *在java中的类型为：String
     **/
    name?: string;
    /**
     *属性说明：性别
     *在java中的类型为：Sex
     **/
    sex?: string;
    /**
     *属性说明：性别s
     *在java中的类型为：Set
     *在java中的类型为：Sex
     **/
    sexSet?: Set<string>;
    /**
     *属性说明：名称
     *在java中的类型为：String[]
     **/
    names?: Array<string>;
}
