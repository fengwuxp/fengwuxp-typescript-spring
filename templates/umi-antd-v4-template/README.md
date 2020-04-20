
- [bootcdn](https://www.bootcdn.cn/)
- [umijs3.0](https://umijs.org/zh-CN/docs/getting-started)
- [next-app](https://github.com/umijs/next-app/tree/011ui)
- [formily 表单解决方案](https://github.com/alibaba/formily)

#### 基于umijs、ant design v4的模板

#### 登陆、授权
- 授权验证基于spring security
```
  提供登陆插件模块，默认提供以下几种登陆模式：
  1：密码登陆
  2：验证码登陆（手机）
  3：扫码登陆
  4：第三方登陆（微信、qq、支付宝等）

```
- 菜单
```
  简单模式：由本地路由配置决定
  宽松模式：菜单数据根据当前登陆用户从服务端获取，并和本地路由做比较和过滤
  严格模式：菜单和路由数据都由服务端获取

  默认我们使用宽松模式

```
