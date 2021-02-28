

#### spring-router

- 统一路由管理注册
- 路由跳转控制
- 生成路由跳转的方法，通过抓取页面props和state进行参数限定
```
   使用代理实现，生成页面跳转方法的定义，例如
   interface XXRouterHelper{
   
      //页面路径可以通过方法名称得到
      //生成方法定义是通过页面的url生成的
      toMemberView:(params:{},state:{})=>Promise<void>
   }
   
   方法生成规则：将 '/'转换为驼峰，':'转换为 $，例如：
   "/a_view/b" --> a_viewB
   "/a_view/:id" --> a_view$Id
   "/a_view/b/:id" --> a_viewB$Id
   
```
