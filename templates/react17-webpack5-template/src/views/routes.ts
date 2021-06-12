import {RouteConfig} from "react-router-config";
import AsyncLoading from "@/components/loading/AsyncLoading";

export const routes: Array<RouteConfig> = [

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
                requiredAuthentication: false,
                path: "/i18n",
                exact: true,
                component: AsyncLoading(() => import("@/views/i18n/ExampleView"))
            }
        ]
    },
];


