export default [
  {
    name: 'demo管理',
    icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
    routes: [
      {
        name: '演示模块1',
        icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
        path: '/demo/',
        redirect: '/user/list',
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
  },
]
