// https://umijs.org/config/
// import routes from "../.spring/routes";
import routes from "./routes";
import {defineConfig} from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const {REACT_APP_ENV} = process.env;


console.log("process.env.UMI_ENV", REACT_APP_ENV);

export const config = {
    hash: false,
    antd: {},
    locale: {
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        antd: true,
        baseNavigator: true,
    },
    dynamicImport: {
        loading: '@/components/pageloading/index',
    },
    targets: {
        ie: 11,
    },
    // umi routes: https://umijs.org/zh/guide/router.html
    routes: [
        {
            path: '/',
            component: '../layouts/BlankLayout',
            routes: [
                {
                    path: '/user',
                    component: '../layouts/UserLayout',
                    Routes: ['./src/DefaultPrivateRoute'],
                    routes: [
                        {
                            path: '/user',
                            redirect: '/user/login',
                        },
                        {
                            name: 'login',
                            icon: 'crown',
                            // icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
                            path: '/user/login',
                            component: './user/LoginView',
                        },
                        {
                            component: '404',
                        },
                    ]
                },
                {
                    path: '/',
                    component: '../layouts/BasicLayout',
                    Routes: ['./src/DefaultPrivateRoute'],
                    routes: routes,
                    // routes: [
                    //   {
                    //     name: 'demo管理',
                    //     icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
                    //     path: '/demo/',
                    //     routes: [
                    //       {
                    //         name: '演示模块1',
                    //         icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
                    //         path: '/demo/',
                    //         // component: './demo/DemoListView',
                    //         routes: [
                    //           {
                    //             name: 'demo列表',
                    //             icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
                    //             path: '/demo/list',
                    //             component: './demo/DemoListView',
                    //           },
                    //           {
                    //             name: '创建demo',
                    //             icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
                    //             path: '/demo/create',
                    //             component: './demo/CreateDemoView',
                    //           },
                    //         ]
                    //       }
                    //     ]
                    //   },
                    // ],
                },
                {
                    component: '404',
                },
            ]
        }
    ],
    theme: {
        // ...darkTheme,
        'primary-color': defaultSettings.primaryColor,
    },
    ignoreMomentLocale: true,
    proxy: proxy[REACT_APP_ENV || 'dev'],
    manifest: {
        basePath: '/',
    },
    externals: {
        // "react": "window.React",
        // "react-dom": "window.ReactDOM",
        // "rxjs": "window.Rxjs",
        // "antd": "window.Antd"
    },
    extraBabelPlugins: [
        // [
        //     "import",
        //     {
        //         "libraryName": "@ant-design/icons",
        //         "libraryDirectory": "",
        //         "style": false,
        //         camel2DashComponentName: false
        //     },
        //     "@ant-design/icons"
        // ]
    ]
};
export default defineConfig(config);
