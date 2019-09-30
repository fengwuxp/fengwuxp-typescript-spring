

#### 通用的代理工厂实现

```
   //仅做代理
   ProxyFactory.newInstance<T>(target: T,
                         methodInterceptor: MethodInterceptor,
                         setPropertyInterceptor?: SetPropertyInterceptor,
                         scope?: ProxyScope,
                         customMatch?: CustomMatchType): T => {=>{
   
       //对原本的方法增加代理实现
   
   })
   
   //代理的同时增强这个对象
   ProxyFactory.newInstanceEnhance<T>(proxyTarget,(method,methodName,args)=>{
      
          // 对原本的方法增加代理实现
      
   },(holder,method,args)=>{
      //当调用原本不存在的方法时做处理
   })
```