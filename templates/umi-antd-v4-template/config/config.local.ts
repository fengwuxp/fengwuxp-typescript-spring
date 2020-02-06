import config from "./config";
import {IConfig} from "umi-types";
import {rewriteCooke} from "./utils";

console.log("use local file");

export default {
  ...config,
  define: {
    "process.env.API_ADDRESS": "/api",
  },
  proxy: {
    '/api': {
      target: 'http://localhost:8090/api/',
      pathRewrite: {'^/api': '/'},
      changeOrigin: true,
      secure: false,
      //代理结果响应处理
      onProxyRes: function (proxyRes, req, res) {
        //重写cookie
        rewriteCooke(proxyRes, req, res)('api');
      }
    }
  }
} as IConfig
