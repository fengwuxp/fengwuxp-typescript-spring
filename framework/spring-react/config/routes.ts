import {IRoute} from "umi-types/config";
import {ViewShowMode} from "fengwuxp-routing-core";

const routes: IRoute[] = [

    {
        name: 'example管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: 'example',
        routes: [

            {
                name: '/example/first/list',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/example/first',
                routes: [

                    {
                        name: '/example/first/list',

                        path: '/example/first/list',

                        condition: "#member!=null",


                        component: './example/first/list',
                    },

                ]
            },

            {
                name: '/example/secoend/list',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/example/secoend',
                routes: [

                    {
                        name: '/example/secoend/list',

                        path: '/example/secoend/list',

                        condition: "#member!=null",


                        component: './example/secoend/list',
                    },

                ]
            },

            {
                name: '标题',

                icon: require("react"),

                path: '/example/three',
                routes: [

                    {
                        name: '标题',

                        icon: require("react"),

                        path: '/example/three/dash_board',

                        condition: "#member.add",


                        showMode: ViewShowMode.DIALOG,

                        component: './example/three/DashBoard',
                    },

                ]
            },

        ]
    },


    {
        name: '/goods/list管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/goods',
        routes: [

            {
                name: '/goods/list',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/goods',
                routes: [

                    {
                        name: '/goods/list',

                        path: '/goods/list',


                        component: './goods/list',
                    },

                ]
            },

        ]
    },


    {
        name: '/index管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/index',
        routes: [

            {
                name: '/index',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/index',
                routes: [

                    {
                        name: '/index',

                        path: '/index',

                        condition: "member.add",


                        component: './index',
                    },

                ]
            },

        ]
    },


    {
        name: '/member/list管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/member',
        routes: [

            {
                name: '/member/list',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/member',
                routes: [

                    {
                        name: '/member/list',

                        path: '/member/list',


                        component: './member/list',
                    },

                ]
            },

        ]
    },


    {
        name: '用户编辑管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/member_edit',
        routes: [

            {
                name: '用户编辑',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/member_edit',
                routes: [

                    {
                        name: '用户编辑',

                        path: '/member_edit',

                        condition: context => {
                            return false;
                        },


                        component: './member/edit',
                    },

                ]
            },

        ]
    },


    {
        name: '/order/list管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/order',
        routes: [

            {
                name: '/order/list',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/order',
                routes: [

                    {
                        name: '/order/list',

                        path: '/order/list',


                        component: './order/list',
                    },

                ]
            },

        ]
    },


]


export default routes
