import {ProxyConfigMap} from "webpack-dev-server";


export const httpProxyConfig: ProxyConfigMap = {

    "local": {
        target: "",
        changeOrigin: true,
        pathRewrite: {
            "^/api": `/`
        },
        onProxyReq(proxyReq, req) {
            const origin = `${req.protocol}://${req.hostname}:3000`;
            proxyReq.setHeader("origin", origin);
        },
    },
}
