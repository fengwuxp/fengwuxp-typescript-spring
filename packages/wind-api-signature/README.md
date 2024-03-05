

#### Api 签名工具
- 参见[通过签名方式访问接口](https://www.yuque.com/suiyuerufeng-akjad/wind/zl1ygpq3pitl00qp)

```typescript
const API_SIGNER = ApiRequestSinger.hmacSha256(
    { accessId: 'xxx', secretKey:'xxx' },
    { headerPrefix: 'xxx', debug: false },
);

/**
 * 接口签名
 * @param method
 * @param url
 * @param queryParams
 * @param requestBody
 * @param contentType
 * @returns
 */
const signature = (method: any, url: any, queryParams: any, requestBody: any, contentType: any) => {
    const result = API_SIGNER.sign({
        method,
        requestPath: url,
        queryParams: queryParams,
        requestBody: serializeSignRequestBody(requestBody, contentType),
    });
    return {
        ...result
    };
};


```