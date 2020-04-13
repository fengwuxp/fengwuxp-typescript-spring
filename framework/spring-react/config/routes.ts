import {IRoute} from "umi-types/config";
import {ViewShowMode} from "fengwuxp-routing-core";

const routes: IRoute[] =[
                
                 {
                               name: 'example管理',
                               
                                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                
                                path: 'example',
                                routes: [
                                 
                                 {
                                 name: '/example/first/list',
                                 
                                 icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                 
                                  path: '/example/first',
                                  routes: [
                                           
                                            {
                                              name: '/example/first/list',
                                              
                                              path: '/example/first/list',
                                              
                                                  condition: "#member!=null",
                                              
                                              
                                              
                                              component: './example/first/list',
                                            },
                                    
                                            {
                                              name: '/example/first/edit',
                                              
                                              path: '/example/first/edit',
                                              
                                                  condition: context => {
  return false;
},
                                              
                                              
                                              
                                              component: './example/first/edit',
                                            },
                                    
                                            {
                                              name: '/example/first/input',
                                              
                                              path: '/example/first/input',
                                              
                                                  condition: "#member.add",
                                              
                                              
                                              
                                              component: './example/first/input',
                                            },
                                    
                                            {
                                              name: '标题',
                                              
                                                icon: require("react"),
                                               
                                              path: '/example/first/detail',
                                              
                                                  condition: "#member.add",
                                              
                                              
                                                showMode:ViewShowMode.DIALOG,
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './example/first/detail',
                                            },
                                    
                                   ]
                                 },
                                  
                                 {
                                 name: '/example/secoend/list',
                                 
                                 icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                 
                                  path: '/example/secoend',
                                  routes: [
                                           
                                            {
                                              name: '/example/secoend/list',
                                              
                                              path: '/example/secoend/list',
                                              
                                                  condition: "#member!=null",
                                              
                                              
                                              
                                              component: './example/secoend/list',
                                            },
                                    
                                            {
                                              name: '/example/secoend/edit',
                                              
                                              path: '/example/secoend/edit',
                                              
                                                  condition: context => {
  return false;
},
                                              
                                              
                                              
                                              component: './example/secoend/edit',
                                            },
                                    
                                            {
                                              name: '/example/secoend/input',
                                              
                                              path: '/example/secoend/input',
                                              
                                                  condition: "#member.add",
                                              
                                              
                                              
                                              component: './example/secoend/input',
                                            },
                                    
                                            {
                                              name: '标题',
                                              
                                                icon: require("react"),
                                               
                                              path: '/example/secoend/detail',
                                              
                                                  condition: "#member.add",
                                              
                                              
                                                showMode:ViewShowMode.DIALOG,
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './example/secoend/detail',
                                            },
                                    
                                   ]
                                 },
                                  
                                 {
                                 name: '标题',
                                 
                                 icon: require("react"),
                                 
                                  path: '/example/three',
                                  routes: [
                                           
                                            {
                                              name: '标题',
                                              
                                                icon: require("react"),
                                               
                                              path: '/example/three/dash_board',
                                              
                                                  condition: "#member.add",
                                              
                                              
                                                showMode:ViewShowMode.DIALOG,
                                              
                                              
                                              component: './example/three/DashBoard',
                                            },
                                    
                                   ]
                                 },
                                  
                              ]
                 },

               
                 {
                               name: '/goods/list管理',
                               
                                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                
                                path: '/goods',
                                routes: [
                                 
                                 {
                                 name: '/goods/list',
                                 
                                 icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                 
                                  path: '/goods',
                                  routes: [
                                           
                                            {
                                              name: '/goods/list',
                                              
                                              path: '/goods/list',
                                              
                                              
                                              
                                              component: './goods/list',
                                            },
                                    
                                            {
                                              name: '/goods/input',
                                              
                                              path: '/goods/input',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                              component: './goods/input',
                                            },
                                    
                                            {
                                              name: '/goods/edit',
                                              
                                              path: '/goods/edit',
                                              
                                                  condition: context => {
  return false;
},
                                              
                                              
                                              
                                              component: './goods/edit',
                                            },
                                    
                                            {
                                              name: '/goods/detail',
                                              
                                              path: '/goods/detail',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './goods/detail',
                                            },
                                    
                                   ]
                                 },
                                  
                              ]
                 },

               
                 {
                               name: '/index管理',
                               
                                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                
                                path: '/index',
                                routes: [
                                 
                                 {
                                 name: '/index',
                                 
                                 icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                 
                                  path: '/index',
                                  routes: [
                                           
                                            {
                                              name: '/index',
                                              
                                              path: '/index',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                              component: './index',
                                            },
                                    
                                   ]
                                 },
                                  
                              ]
                 },

               
                 {
                               name: '/member/list管理',
                               
                                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                
                                path: '/member',
                                routes: [
                                 
                                 {
                                 name: '/member/list',
                                 
                                 icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                 
                                  path: '/member',
                                  routes: [
                                           
                                            {
                                              name: '/member/list',
                                              
                                              path: '/member/list',
                                              
                                              
                                              
                                              component: './member/list',
                                            },
                                    
                                            {
                                              name: '/member/input',
                                              
                                              path: '/member/input',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                              component: './member/input',
                                            },
                                    
                                            {
                                              name: '详情',
                                              
                                              path: '/member/detail',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './member/detail',
                                            },
                                    
                                   ]
                                 },
                                  
                              ]
                 },

               
                 {
                               name: '用户编辑管理',
                               
                                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                
                                path: '/member_edit',
                                routes: [
                                 
                                 {
                                 name: '用户编辑',
                                 
                                 icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                 
                                  path: '/member_edit',
                                  routes: [
                                           
                                            {
                                              name: '用户编辑',
                                              
                                              path: '/member_edit',
                                              
                                                  condition: context => {
  return false;
},
                                              
                                              
                                              
                                              component: './member/edit',
                                            },
                                    
                                   ]
                                 },
                                  
                              ]
                 },

               
                 {
                               name: '/order/list管理',
                               
                                icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                
                                path: '/order',
                                routes: [
                                 
                                 {
                                 name: '/order/list',
                                 
                                 icon: require('@ant-design/icons-svg/lib/asn/SmileOutlined').default,
                                 
                                  path: '/order',
                                  routes: [
                                           
                                            {
                                              name: '/order/list',
                                              
                                              path: '/order/list',
                                              
                                              
                                              
                                              component: './order/list',
                                            },
                                    
                                            {
                                              name: '/order/input',
                                              
                                              path: '/order/input',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                              component: './order/input',
                                            },
                                    
                                            {
                                              name: '/order/edit',
                                              
                                              path: '/order/edit',
                                              
                                                  condition: context => {
  return false;
},
                                              
                                              
                                              
                                              component: './order/edit',
                                            },
                                    
                                            {
                                              name: '/order/detail',
                                              
                                              path: '/order/detail',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './order/detail',
                                            },
                                    
                                   ]
                                 },
                                  
                              ]
                 },

               
    ]


export default routes
