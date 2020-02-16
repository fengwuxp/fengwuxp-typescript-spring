
        import {ApiQueryReq} from "oak-common";
        import {Week} from "../../../enums/Week";

    /**
    * 查询example例子
    **/

export interface  QueryExampleEntityReq extends ApiQueryReq {

        /**
            *id
            *在java中的类型为：Long
        **/
        id?: number;
        /**
            *name
            *在java中的类型为：String
        **/
        name?: string;
        /**
            *年龄
            *在java中的类型为：Integer
        **/
        age?: number;
        /**
            *头像
            *在java中的类型为：String
        **/
        avatarUrl?: string;
        /**
            *账户余额
            *在java中的类型为：Integer
        **/
        money?: number;
        /**
            *最小生日
            *在java中的类型为：Date
        **/
        minBirthday?: Date;
        /**
            *最大生日
            *在java中的类型为：Date
        **/
        maxBirthday?: Date;
        /**
            *星期
            *在java中的类型为：Week
        **/
        week?: Week;
        /**
            *例子id
            *在java中的类型为：Long
        **/
        exampleId?: number;
        /**
            *是否删除
            *在java中的类型为：Boolean
        **/
        deleted?: boolean;
        /**
            *排序代码
            *在java中的类型为：Integer
        **/
        orderCode?: number;
        /**
            *是否允许
            *在java中的类型为：Boolean
        **/
        enable?: boolean;
        /**
            *是否可编辑
            *在java中的类型为：Boolean
        **/
        editable?: boolean;
        /**
            *最小创建时间
            *在java中的类型为：Date
        **/
        minCreateTime?: Date;
        /**
            *最大创建时间
            *在java中的类型为：Date
        **/
        maxCreateTime?: Date;
        /**
            *最小更新时间
            *在java中的类型为：Date
        **/
        minLastUpdateTime?: Date;
        /**
            *最大更新时间
            *在java中的类型为：Date
        **/
        maxLastUpdateTime?: Date;
        /**
            *备注
            *在java中的类型为：String
        **/
        remark?: string;
}
