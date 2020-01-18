
        import {Sex} from "../../enums/Sex";

    /**
        * 类：用户信息
    **/

export interface  MemberInfo {

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
            *属性说明：测试
            *在java中的类型为：Sex[]
        **/
        test_sexs?: Array<string>;
        /**
            *属性说明：dates
            *在java中的类型为：Set
            *在java中的类型为：Date
        **/
        dates?: Array<number>;
        /**
            *属性说明：maps
            *在java中的类型为：Map
            *在java中的类型为：String
            *在java中的类型为：Set
            *在java中的类型为：Sex[]
        **/
        maps?: Record<string,Array<Array<string>>>;
        /**
            *属性说明：添加时间
            *在java中的类型为：Date
        **/
        addTime?: number;
}