
        import {ApiReq} from "oak-common";
        import {Sex} from "../../enums/Sex";

    /**
        * 类：创建用户
    **/

export interface  CreateMemberEvt extends ApiReq {

        /**
            *属性说明：用户名名称
            *属性：name为必填项，不能为空
            *在java中的类型为：String
        **/
        name: string;
        /**
            *属性说明：性别
            *在java中的类型为：Sex
        **/
        sex?: string;
        /**
            *属性说明：添加时间
            *在java中的类型为：Date
        **/
        addTime?: Date;
}