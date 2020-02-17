import config from "./config";
import {IConfig} from "umi-types";
import {rewriteCooke} from "./utils";

console.log("use local file");

export default {
  ...config,
  define: {
    "process.env.API_ADDRESS": "/api",
    "process.env.APP_ID": "app",
    "process.env.APP_SECRET": "2aecdd9db7d816462e2232632c90f8fa",
    // 文件上传地址
    "process.env.UPLOAD_FILE_URL": "http://a.b.c.com",
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
