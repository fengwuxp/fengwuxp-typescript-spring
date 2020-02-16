
        import {ApiReq} from "oak-common";
        import {Week} from "../../../enums/Week";

    /**
    * 创建CreateExampleEntityReq的请求
    **/

export interface  CreateExampleEntityReq extends ApiReq {

        /**
            *name
            *属性：name为必填项，不能为空
            *属性：name输入字符串的最小长度为：0，输入字符串的最大长度为：16
            *在java中的类型为：String
        **/
        name: string;
        /**
            *年龄
            *属性：age输入字符串的最小长度为：0，输入字符串的最大长度为：200
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
            *属性：week为必填项，不能为空
            *在java中的类型为：Week
        **/
        week: Week;
        /**
            *例子id
            *属性：exampleId为必填项，不能为空
            *在java中的类型为：Long
        **/
        exampleId: number;
        /**
            *是否删除
            *属性：deleted为必填项，不能为空
            *在java中的类型为：Boolean
        **/
        deleted: boolean;
        /**
            *排序代码
            *在java中的类型为：Integer
        **/
        orderCode?: number;
        /**
            *更新时间
            *在java中的类型为：Date
        **/
        lastUpdateTime?: Date;
        /**
            *备注
            *属性：remark输入字符串的最小长度为：0，输入字符串的最大长度为：1,000
            *在java中的类型为：String
        **/
        remark?: string;
}
