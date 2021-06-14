import AsyncLoading from "@/components/loading/AsyncLoading";
import {AuthenticatedRouteConfig} from "@/components/route/PrivateRoute";

export const routes: Array<AuthenticatedRouteConfig> = [

    {
        path: '/login',
        exact: false,
        component: AsyncLoading(() => import('@/views/LoginView')),
    },
    {
        path: '/',
        exact: false,
        component: AsyncLoading(() => import('@/layouts/BasicLayout')),
        routes: [
            {
                requiredAuthentication: true,
                path: "/demo/list",
                exact: true,
                component: AsyncLoading(() => import("@/views/demo/DemoListView"))
            },
            {
                path: "/i18n",
                exact: true,
                component: AsyncLoading(() => import("@/views/i18n/ExampleView"))
            }
        ]
    },
];


