import {IConfig, IPlugin} from 'umi-types';
import slash from 'slash2';
import defaultSettings from './defaultSettings';
import themePluginConfig from './themePluginConfig';
import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

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
        loadingComponent: './components/PageLoading/index',
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

// plugins.push(['umi-plugin-antd-theme', themePluginConfig]);

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
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
              path: '/user/login',
              component: './user/login',
            },
            {
              component: '404',
            },
          ]
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              name: 'uform',
              icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
              path: '/uform',
              routes: [
                {
                  name: 'site',
                  icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
                  path: '/uform/simple',
                  component: './uform/simple',
                },
                {
                  name: 'verification',
                  icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
                  path: '/uform/verification',
                  component: './uform/verification',
                },
              ]
            },

            {
              name: '表格',
              // icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
              path: '/table',
              routes: [
                {
                  name: '搜索表格',
                  icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
                  path: '/table/demo',
                  component: './list/table-list/',
                }
              ]
            }

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
  // publicPath: "/static_resources/",
  // externals: {
  //   "react": "window.React",
  //   "react-dom": "window.ReactDOM"
  // },
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
    ],
    // [
    //   "import",
    //   {
    //     "libraryName": "@uform/antd",
    //     "libraryDirectory": "esm",
    //     "style": false,
    //     camel2DashComponentName: false
    //   },
    //   "@uform/antd"
    // ]
  ],
  chainWebpack: function (config, {webpack}) {

    // console.log("--from-->", path.resolve(__dirname, "../src/assets/svg/"));
    // console.log("--to-->", path.resolve(__dirname, `../dist/static/svg/`));
    config.plugin("copy-static-resources").use(CopyWebpackPlugin, [
      [
        {
          from: path.resolve(__dirname, "../src/assets/svg/"),
          to: path.resolve(__dirname, `../dist/static/svg/`)
        },
      ]
    ]);

  },
  treeShaking: false
} as IConfig;
