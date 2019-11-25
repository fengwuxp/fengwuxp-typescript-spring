

#### 声明式路由跳转
- 统一抽象路由跳转
- 提供声明式Api

```
  
   // 声明App路由
  
   interface MockAppRouter extends NavigatorAdapter, AppCommandRouter {

    login: RouterCommandMethod;

    index: RouterCommandMethod;

    webview: RouterCommandMethod;

    my: RouterCommandMethod;

    goodsById: RouterCommandMethod<number>;

    popToTopGoodsDetail: RouterCommandMethod<{ id: number }>;

    pushOrderDetail: RouterCommandMethod<{ id: string }>;

    toOrderDetail: RouterCommandMethod<{ id: string }>;

    pushOrderDetailById: RouterCommandMethod<string>;

    toModuleByUserId: RouterCommandMethod<[string, number]>;

    reLaunchOrderDetailById: RouterCommandMethod<string>;

    replaceOrderDetailById: RouterCommandMethod<string>;
}

   // 创建应用路由
   const mockAppRouter: MockAppRouter = appCommandRouterFactory<MockAppRouter>({})

   // 调用
   mockAppRouter.login();
   mockAppRouter.webview({url:1});
   mockAppRouter.index();

    mockAppRouter["home"]();

```
