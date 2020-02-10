export default [

  {
    name: 'demo',
    path: '/demo',
    redirect: '/demo/list',
    routes: [

      {
        name: 'list',
        icon: require(`@ant-design/icons-svg/lib/asn/SmileOutlined`).default,
        path: '/demo/list',
        component: './demo/DemoListView',
      },

      {
        name: 'edit',
        icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
        path: '/demo/edit',
        component: './demo/EditDemoView',
      },

      {
        name: 'detail',
        icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
        path: '/demo/detail',
        component: './demo/DemoDetailView',
      },

      {
        name: 'create_demo',
        icon: require(`@ant-design/icons-svg/lib/asn/AccountBookOutlined`).default,
        path: '/demo/create_demo',
        component: './demo/CreateDemoView',
      },

    ]
  },

]
