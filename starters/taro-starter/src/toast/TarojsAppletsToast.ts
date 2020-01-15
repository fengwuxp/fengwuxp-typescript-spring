import * as Taro from "@tarojs/taro";
import {showToast as Toast} from '@tarojs/taro';


export const showToast = (options: Toast.Option) => {

    const _o = {...options};

    return new Promise<void>(resolve => {
        const {duration} = _o;
        _o.icon = _o.icon || "none";
        Taro.showToast(_o);
        setTimeout(() => {
            Taro.hideLoading();
            resolve();
        }, duration || 1500);
    });
};
