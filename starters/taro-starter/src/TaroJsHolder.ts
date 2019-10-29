import * as Taro from "@tarojs/taro";


export type TaroInterface = typeof Taro;


export interface TaroInterfaceHolder {
    taro: TaroInterface;
}

/**
 * taro实例的持有者
 * 要在应用程序路入口初始化
 */
export default class TaroJsHolder {


    protected static HOLDER: TaroInterfaceHolder = {
        taro: null
    };


    public static getTaroHolder = (): TaroInterfaceHolder => TaroJsHolder.HOLDER;

    public static setTaroHolder = (taro: TaroInterface) => {
        TaroJsHolder.HOLDER.taro = taro;
    }

}