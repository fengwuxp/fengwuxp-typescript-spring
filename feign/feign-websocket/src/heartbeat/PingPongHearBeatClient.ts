import {KeepHearBeatConnection} from "./KeepHearBeatConnection";


export default class PingPongHearBeatClient implements KeepHearBeatConnection{


    isConnected=(): boolean=> {
        return false;
    }



}