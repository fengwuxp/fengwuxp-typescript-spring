export default [

    {
        name: '管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/example',

        redirect: '/example/list',

        routes: [
            {
                name: '',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/example',

                redirect: '/example/list',

                routes: [

                    {
                        name: '',
                        path: '/example/list',
                        component: './example/list',
                    },

                    {
                        name: '',
                        path: '/example/edit',
                        component: './example/edit',
                    },

                    {
                        name: '',
                        path: '/example/input',
                        component: './example/input',
                    },

                    {
                        name: '',
                        path: '/example/detail',
                        component: './example/detail',
                    },

                ]
            }
        ]
    },


    {
        name: '管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/goods',

        redirect: '/goods/list',

        routes: [
            {
                name: '',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/goods',

                redirect: '/goods/list',

                routes: [

                    {
                        name: '',
                        path: '/goods/list',
                        component: './goods/list',
                    },

                    {
                        name: '',
                        path: '/goods/input',
                        component: './goods/input',
                    },

                    {
                        name: '',
                        path: '/goods/edit',
                        component: './goods/edit',
                    },

                    {
                        name: '',
                        path: '/goods/detail',
                        component: './goods/detail',
                    },

                ]
            }
        ]
    },


    {
        name: '管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/index',

        redirect: '/index',

        routes: [
            {
                name: '',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/index',

                redirect: '/index',

                routes: [

                    {
                        name: '',
                        path: '/index',
                        component: './pages/index',
                    },

                ]
            }
        ]
    },


    {
        name: '管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/member',

        redirect: '/member/list',

        routes: [
            {
                name: '',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/member',

                redirect: '/member/list',

                routes: [

                    {
                        name: '',
                        path: '/member/list',
                        component: './member/list',
                    },

                    {
                        name: '',
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

        redirect: '/member_edit',

        routes: [
            {
                name: '用户编辑',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/member_edit',

                redirect: '/member_edit',

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
        name: '管理',

        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

        path: '/order',

        redirect: '/order/list',

        routes: [
            {
                name: '',

                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,

                path: '/order',

                redirect: '/order/list',

                routes: [

                    {
                        name: '',
                        path: '/order/list',
                        component: './order/list',
                    },

                    {
                        name: '',
                        path: '/order/input',
                        component: './order/input',
                    },

                    {
                        name: '',
                        path: '/order/edit',
                        component: './order/edit',
                    },

                    {
                        name: '',
                        path: '/order/detail',
                        component: './order/detail',
                    },

                ]
            }
        ]
    },


]
