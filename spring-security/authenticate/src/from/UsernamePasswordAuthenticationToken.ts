import {Authentication} from "../Authentication";
import {GrantedAuthority} from "../GrantedAuthority";

/**
 * 用户名密码登录的 对象
 *
 * @see PasswordAuthenticationProvider
 */
export default class UsernamePasswordAuthenticationToken implements Authentication {

    // 用户名
    private username: string;

    // 密码
    private password: string;

    // 验证码
    private captcha?: string;


    constructor(username: string, password: string, captcha: string) {
        this.username = username;
        this.password = password;
        this.captcha = captcha;
    }

    getAuthorities: <T extends GrantedAuthority>() => Array<T>;

    getCredentials: <T extends any>() => T;

    getDetails: <T extends any>() => T;

    getName: () => string;

    getPrincipal: <T extends any>() => T;

    isAuthenticated: () => boolean;

    setAuthenticated: (isAuthenticated: boolean) => void;


}
