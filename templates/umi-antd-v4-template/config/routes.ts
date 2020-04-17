import {IRoute} from "@umijs/core";


const routes: IRoute[] = [

    {
        name: '演示列表管理',
        icon: 'smile',
        path: '/demo',
        routes: [
            {
                name: '演示列表',

                icon: 'smile',

                path: '/demo',
                routes: [

                    {
                        name: '演示列表',

                        path: '/demo/list',
                        component: './demo/DemoListView',
                    },

                    {
                        name: '/demo/edit',

                        path: '/demo/edit',
                        component: './demo/EditDemoView',
                    },

                    {
                        name: '/demo/detail',

                        path: '/demo/detail',
                        component: './demo/DemoDetailView',
                    },

                    {
                        name: '/demo/create',

                        path: '/demo/create',
                        component: './demo/CreateDemoView',
                    },

                ]
            }
        ]
    },


    {
        name: '/example/list管理',

        icon: 'smile',

        path: '/example',
        routes: [
            {
                name: '/example/list',

                icon: 'smile',

                path: '/example',
                routes: [

                    {
                        name: '/example/list',

                        path: '/example/list',
                        component: './example/ExampleListView',
                    },

                    {
                        name: '标题',

                        path: '/example/create',
                        component: './example/CreateExampleView',
                    },

                ]
            }
        ]
    },


]


export default routes
