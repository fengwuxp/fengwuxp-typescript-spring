import {Authentication} from "../Authentication";
import {GrantedAuthority} from "../GrantedAuthority";


export default class UsernamePasswordAuthenticationToken implements Authentication {

    private username: string;

    private password: string;

    getAuthorities: <T extends GrantedAuthority>() => Array<T>;

    getCredentials: <T extends any>() => T;

    getDetails: <T extends any>() => T;

    getName: () => string;

    getPrincipal: <T extends any>() => T;

    isAuthenticated: () => boolean;

    setAuthenticated: (isAuthenticated: boolean) => void;


}
