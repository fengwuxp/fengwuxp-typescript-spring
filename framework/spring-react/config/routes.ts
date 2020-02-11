import {IRoute} from "umi-types/config";

const routes: IRoute[] = [

    {
        name: '/example/list管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/example',
        routes: [
            {
                name: '/example/list',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/example',
                routes: [

                    {
                        name: '/example/list',

                        path: '/example/list',
                        component: './example/list',
                    },

                    {
                        name: '/example/edit',

                        path: '/example/edit',
                        component: './example/edit',
                    },

                    {
                        name: '/example/input',

                        path: '/example/input',
                        component: './example/input',
                    },

                    {
                        name: '/example/detail',

                        icon: require("react"),

                        path: '/example/detail',
                        component: './example/detail',
                    },

                ]
            }
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

                    {
                        name: '/goods/input',

                        path: '/goods/input',
                        component: './goods/input',
                    },

                    {
                        name: '/goods/edit',

                        path: '/goods/edit',
                        component: './goods/edit',
                    },

                    {
                        name: '/goods/detail',

                        path: '/goods/detail',
                        component: './goods/detail',
                    },

                ]
            }
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
                        component: './pages/index',
                    },

                ]
            }
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

                    {
                        name: '/member/input',

                        path: '/member/input',
                        component: './member/input',
                    },

                    {
                        name: '详情',

                        path: '/member/detail',
                        component: './member/detail',
                    },

                ]
            }
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
                        component: './member/edit',
                    },

                ]
            }
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

                    {
                        name: '/order/input',

                        path: '/order/input',
                        component: './order/input',
                    },

                    {
                        name: '/order/edit',

                        path: '/order/edit',
                        component: './order/edit',
                    },

                    {
                        name: '/order/detail',

                        path: '/order/detail',
                        component: './order/detail',
                    },

                ]
            }
        ]
    },


]


export default routes
