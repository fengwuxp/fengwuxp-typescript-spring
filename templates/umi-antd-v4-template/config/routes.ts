const routes = [

  {
    name: '',
    // icon: require(`@ant-design/icons-svg/lib/asn/AimOutlined`).default,
    path: '/demo',
    redirect: '/demo',
    routes: [

      {
        name: '',
        path: '/demo/createdemoview',
        component: './demo/CreateDemoView',
      },

      {
        name: '',
        path: '/demo/demodetailview',
        component: './demo/DemoDetailView',
      },

      {
        name: '',
        path: '/demo/demolistview',
        component: './demo/DemoListView',
      },

      {
        name: '',
        path: '/demo/editdemoview',
        component: './demo/EditDemoView',
      },
    ]
  }

];
export default routes
