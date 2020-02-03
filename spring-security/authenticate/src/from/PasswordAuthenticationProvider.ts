import {AuthenticationProvider} from "../AuthenticationProvider";
import {Authentication} from "../Authentication";
import UsernamePasswordAuthenticationToken from "./UsernamePasswordAuthenticationToken";


export default class PasswordAuthenticationProvider implements AuthenticationProvider {

    authenticate = (authentication: UsernamePasswordAuthenticationToken) => {

        return null;
    };


    supports = (authenticationType: any) => {

        return authenticationType === UsernamePasswordAuthenticationToken;
    };


}
