import {Week} from "../../../enums/Week";

/**
    * example例子
    **/

export interface  ExampleEntityInfo {

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
            *生日
            *在java中的类型为：Date
        **/
        birthday?: Date;
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
            *创建时间
            *在java中的类型为：Date
        **/
        createTime?: Date;
        /**
            *更新时间
            *在java中的类型为：Date
        **/
        lastUpdateTime?: Date;
        /**
            *备注
            *在java中的类型为：String
        **/
        remark?: string;
}
