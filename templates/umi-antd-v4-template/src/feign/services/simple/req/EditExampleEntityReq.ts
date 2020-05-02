import {ApiReq} from "oak-common";
import {Week} from "../../../enums/Week";

/**
    * 编辑example例子
    **/

export interface  EditExampleEntityReq extends ApiReq {

        /**
            *id
            *属性：id为必填项，不能为空
            *在java中的类型为：Long
        **/
        id: number;
        /**
            *属性：name输入字符串的最小长度为：0，输入字符串的最大长度为：16
            *name
            *在java中的类型为：String
        **/
        name?: string;
        /**
            *属性：age输入字符串的最小长度为：0，输入字符串的最大长度为：200
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
            *更新时间
            *在java中的类型为：Date
        **/
        lastUpdateTime?: Date;
        /**
            *属性：remark输入字符串的最小长度为：0，输入字符串的最大长度为：1,000
            *备注
            *在java中的类型为：String
        **/
        remark?: string;
}
