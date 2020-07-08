import {ViewShowMode} from "fengwuxp-routing-core";
import {IRoute} from "umi";

const routes: IRoute[] =[
                
                 {
                               name: '测试',
                               
                                icon: 'smile',
                                

                                path: '/example',
                                routes: [
                                 
                                 {
                                 name: '/example/first/list',
                                 
                                 icon: 'smile',
                                 
                                  
                                   hideInMenu: true,
                                 
                                  path: '/example/first',
                                  routes: [
                                           
                                            {
                                              name: '/example/first/list',
                                              
                                              path: '/example/first/list',
                                              
                                                  condition: "#member!=null",
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './example/first/list',
                                            },
                                    
                                            {
                                              name: '/example/first/edit',
                                              
                                              path: '/example/first/edit',
                                              
                                                  condition: context => {
  return false;
},
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './example/first/edit',
                                            },
                                    
                                            {
                                              name: '/example/first/input',
                                              
                                              path: '/example/first/input',
                                              
                                                  condition: "#member.add",
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
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
                                 
                                 icon: 'smile',
                                 
                                  
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
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
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
                               name: '测2',
                               
                                icon: 'smile',
                                

                                path: '/index',
                                routes: [
                                 
                                 {
                                 name: '/index',
                                 
                                 icon: 'smile',
                                 
                                  
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
                               name: '/goods/list',
                               
                                icon: 'smile',
                                

                                path: '/goods',
                                routes: [
                                 
                                 {
                                 name: '/goods/list',
                                 
                                 icon: 'smile',
                                 
                                  
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
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
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
                               name: '/goods_list/list',
                               
                                icon: 'smile',
                                

                                path: '/goods_list',
                                routes: [
                                 
                                 {
                                 name: '/goods_list/list',
                                 
                                 icon: 'smile',
                                 
                                  
                                  path: '/goods_list',
                                  routes: [
                                           
                                            {
                                              name: '/goods_list/list',
                                              
                                              path: '/goods_list/list',
                                              
                                              
                                              
                                              component: './goods_list/list',
                                            },
                                    
                                            {
                                              name: '/goods_list/input',
                                              
                                              path: '/goods_list/input',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                              component: './goods_list/input',
                                            },
                                    
                                            {
                                              name: '/goods_list/edit',
                                              
                                              path: '/goods_list/edit',
                                              
                                                  condition: context => {
  return false;
},
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './goods_list/edit',
                                            },
                                    
                                            {
                                              name: '/goods_list/detail',
                                              
                                              path: '/goods_list/detail',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './goods_list/detail',
                                            },
                                    
                                            {
                                              name: '/goods_list/close',
                                              
                                              path: '/goods_list/close',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                              component: './goods_list/CloseGoodsView',
                                            },
                                    
                                   ]
                                 },
                                  
                              ]
                 },

               
                 {
                               name: '/member/list',
                               
                                icon: 'smile',
                                

                                path: '/member',
                                routes: [
                                 
                                 {
                                 name: '/member/list',
                                 
                                 icon: 'smile',
                                 
                                  
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
                                              name: '用户编辑',
                                              
                                              path: '/member/edit',
                                              
                                                  condition: context => {
  return false;
},
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './member/edit',
                                            },
                                    
                                            {
                                              name: '详情',
                                              
                                              path: '/member/detail',
                                              
                                                  condition: "member.add",
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
                                              component: './member/detail',
                                            },
                                    
                                            {
                                              name: '用户禁用',
                                              
                                              path: '/member/close',
                                              
                                                  condition: context => {
  return false;
},
                                              
                                              
                                              
                                              component: './member/close',
                                            },
                                    
                                   ]
                                 },
                                  
                              ]
                 },

               
                 {
                               name: '/order/list',
                               
                                icon: 'smile',
                                

                                path: '/order',
                                routes: [
                                 
                                 {
                                 name: '/order/list',
                                 
                                 icon: 'smile',
                                 
                                  
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
                                              
                                              
                                              
                                                 hideInMenu:true,
                                              
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
