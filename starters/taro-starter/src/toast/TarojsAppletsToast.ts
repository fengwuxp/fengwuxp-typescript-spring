// @ts-ignore
import Taro from "@tarojs/taro";

export const  showToast = (options: Taro.showToast.Option) => {

    const _o = {...options};
    return new Promise<void>(resolve => {
        const {duration} = _o;
        _o.icon = _o.icon || "none";
        return Taro.showToast(_o).then((result) => {
            setTimeout(() => {
                Taro.hideLoading();
                resolve();
            }, duration || 1500);
        });

    });
};
