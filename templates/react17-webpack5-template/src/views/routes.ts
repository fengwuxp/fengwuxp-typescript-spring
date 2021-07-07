import AsyncLoading from "@/components/loading/AsyncLoading";
import {AuthenticatedRouteConfig} from "@/components/route/PrivateRoute";

export const routes: Array<AuthenticatedRouteConfig> = [
    {
        requiredAuthentication: false,
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
                path: "/demo/list",
                exact: true,
                requiredAuthentication: true,
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


