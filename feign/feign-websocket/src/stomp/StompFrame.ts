import {StompCommand} from "./StompCommand";
import { contentLengthName } from 'fengwuxp-typescript-feign';


export interface StompFrame {

    command: StompCommand,

    body: any;

    headers: Record<string, any>

}
