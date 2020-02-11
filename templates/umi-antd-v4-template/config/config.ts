import {IConfig, IPlugin} from 'umi-types';
import slash from 'slash2';
import defaultSettings from './defaultSettings';
import themePluginConfig from './themePluginConfig';
import {webpackPlugin} from "./plugin.config";
// import routes from "../.spring/routes";
import routes from "./routes";

const plugins: IPlugin[] = [
  // ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: {
        importDirectory: "es"
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/loading/index',
        webpackChunkName: true,
        level: 3,
      },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
  [
    "umi-plugin-antd-theme",
    themePluginConfig
  ]
];

console.log("process.env.UMI_ENV", process.env.UMI_ENV, routes);

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: false,
  targets: {
    ie: 11,
  },
  theme: {
    '@primary-color': defaultSettings.primaryColor,
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
          // Routes: ['./src/DefaultPrivateRoute'],
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
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
          // Routes: ['./src/DefaultPrivateRoute'],
          // routes: routes,
          routes: [
            {
              name: 'demo管理',
              icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
              path: '/demo/',
              routes: [
                {
                  name: '演示模块1',
                  icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
                  path: '/demo/',
                  // component: './demo/DemoListView',
                  routes: [
                    {
                      name: 'demo列表',
                      icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
                      path: '/demo/list',
                      component: './demo/DemoListView',
                    },
                    {
                      name: '创建demo',
                      icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
                      path: '/demo/create',
                      component: './demo/CreateDemoView',
                    },
                  ]
                }
              ]
              // routes:[
              //   {
              //     name: 'demo列表',
              //     icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
              //     path: '/demo/list',
              //     component: './demo/DemoListView',
              //   },
              //   {
              //     name: '创建demo',
              //     icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
              //     path: '/demo/create',
              //     component: './demo/CreateDemoView',
              //   },
              // ]
            },
          ],
        },
        {
          component: '404',
        },
      ]
    }
  ],
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less') ||
        !context.resourcePath.includes('example')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // alias: {
  //   'static': path.resolve(__dirname, '../static/')
  // },
  publicPath: "/static_resources/",
  define: {
    "process.env.UMI_ENV": process.env.UMI_ENV,
    "process.env.API_ADDRESS": "/api",
  },
  externals: {
    // "react": "window.React",
    // "react-dom": "window.ReactDOM",
    // "rxjs": "window.Rxjs",
    // "antd": "window.Antd"
  },
  extraBabelIncludes: [
    /node_modules[\\/][\\@]uform[\\/]antd[\\/]esm/
  ],
  extraBabelPlugins: [
    [
      "import",
      {
        "libraryName": "@ant-design/icons",
        "libraryDirectory": "",
        "style": false,
        camel2DashComponentName: false
      },
      "@ant-design/icons"
    ]
  ],
  chainWebpack: webpackPlugin,
  treeShaking: false
} as IConfig;
