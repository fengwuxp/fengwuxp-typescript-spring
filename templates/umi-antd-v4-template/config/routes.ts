import {IRoute} from "umi-types/config";

const routes: IRoute[] =[
                
                 {
                               name: '演示列表管理',
                               
                                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                
                                path: '/demo',
                               routes: [
                                 {
                                 name: '演示列表',
                                 
                                 icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                 
                                  path: '/demo',
                                  routes: [
                                           
                                            {
                                              name: '演示列表',
                                              
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

               
                 {
                               name: '/example/list管理',
                               
                                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                
                                path: '/example',
                               routes: [
                                 {
                                 name: '/example/list',
                                 
                                 icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                 
                                  path: '/example',
                                  routes: [
                                           
                                            {
                                              name: '/example/list',
                                              
                                              path: '/example/list',
                                              component: './example/ExampleListView',
                                            },
                                    
                                            {
                                              name: '标题',
                                              
                                              path: '/example/crate_example',
                                              component: './example/CrateExampleView',
                                            },
                                    
                                   ]
                                 }
                              ]
                 },

               
    ]


export default routes
