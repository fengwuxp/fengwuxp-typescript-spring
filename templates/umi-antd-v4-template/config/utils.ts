/**
 * 在 webpack dev的proxy中重写cookie
 * @param proxyRes
 * @param req
 * @param res
 */
export const rewriteCooke = (proxyRes, req, res) => {

  /**
   * @proxyServerWebContext {string} 代理的接口服务的上下问路径 例如 http://tst.abc.com/api的上下文路径为 api
   */
  return (proxyServerWebContext: string) => {
    // console.log("重写cookie");
    const cookies = proxyRes.headers['set-cookie'];
    const cookieRegex = new RegExp(`Path=\\/${proxyServerWebContext}\\/`, "i");
    //修改cookie Path
    if (cookies) {
      let newCookie = cookies.map(function (cookie) {
        if (cookieRegex.test(cookie)) {
          return cookie.replace(cookieRegex, 'Path=/');
        }
        return cookie;
      });
      //修改cookie path
      delete proxyRes.headers['set-cookie'];
      proxyRes.headers['set-cookie'] = newCookie;
    }
  }
};
