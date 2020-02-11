import {IRoute} from "umi-types/config";

// const routes: IRoute[] = [
//
//   {
//     name: '/demo/list管理',
//     icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
//     // path: '/demo',
//     routes: [
//       {
//         name: '/demo/list',
//         icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
//         path: '/demo',
//         routes: [
//
//           {
//             name: '/demo/list',
//
//             path: '/demo/list',
//             component: './demo/DemoListView',
//           },
//
//           {
//             name: '/demo/edit',
//
//             path: '/demo/edit',
//             component: './demo/EditDemoView',
//           },
//
//           {
//             name: '/demo/detail',
//
//             path: '/demo/detail',
//             component: './demo/DemoDetailView',
//           },
//
//           {
//             name: '/demo/create',
//
//             path: '/demo/create',
//             component: './demo/CreateDemoView',
//           },
//
//         ]
//       }
//     ]
//   },
// ]

const routes: IRoute[] = [
  {
    name: '/demo/list',
    icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
    path: '/demo',
    routes: [

      {
        name: '/demo/list',

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
  },
  {
    name: '/demo/list管理',
    icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
    // path: '/demo',
    routes: [
      {
        name: '/demo/list',
        icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
        path: '/demo',
        routes: [

          {
            name: '/demo/list',

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
]
export default routes
