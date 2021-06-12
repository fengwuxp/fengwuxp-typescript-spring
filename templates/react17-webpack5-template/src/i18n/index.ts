import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from "i18next";
import HttpBackend from 'i18next-http-backend'
import {initReactI18next} from 'react-i18next';

i18n
    // 加入Backend插件,用于从远程服务器获取国际化资源
    // 插件详见: https://github.com/i18next/react-i18next
    .use(HttpBackend)
    // 探测用户语言
    // 插件详见: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // 初始化配置
    // 所有配置详见: https://www.i18next.com/overview/configuration-options
    .init({
        react: {
            // 是否需要在最外层加入Suspense标签
            useSuspense: false,
        },
        // 设置默认语言
        lng: 'zh-CN',
        fallbackLng: 'zh-CN',
        debug: false,
        load: 'currentOnly',
        // 加载远程资源
        backend:{
            /**
             * 用于构建请求url
             * @param languageCodes 语言编码
             * @param namespaces 名称空间
             */
            loadPath: function (languageCodes: Array<string>, namespaces: Array<string>) {
                console.log("==loadPath===>", languageCodes, namespaces)
                return `http://localhost:9000/locales/${languageCodes[0].toLocaleLowerCase()}.json`;
            },
            /**
             * 是否允许跨域
             */
            crossDomain: true,
            /**
             * 是否允许携带登录凭证
             */
            withCredentials: true,
        },
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    })

export default i18n;
