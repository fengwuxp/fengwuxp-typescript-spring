import {ApiReq} from "oak-common";

/**
    * 删除example例子
    **/

export interface  DeleteExampleEntityReq extends ApiReq {

        /**
            *id
            *在java中的类型为：Long
        **/
        id?: number;
        /**
            *id集合
            *在java中的类型为：Long[]
        **/
        ids?: Array<number>;
}
