module.exports = {
    env: {
        NODE_ENV: '"development"',
        OAK: JSON.stringify({
            //api接口接入账号
            clientId: 'app',
            //api接口接入秘钥
            clientSecret: '3f76f41054769548fa8c8962f2ed0cbb',
        }),
        API_ENTRY_ADDRESS: JSON.stringify("https://xx.oaknt.com/api"),
    },
    defineConstants: {},
    mini: {},
    h5: {}
}
