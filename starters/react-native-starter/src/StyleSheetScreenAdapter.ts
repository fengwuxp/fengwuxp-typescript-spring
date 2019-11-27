import {
    StyleSheet,
    Dimensions,
    PixelRatio
} from 'react-native';

//屏幕宽，部分android机型得到的不是int，故parseInt取整
const screenWidth = Dimensions.get('window').width;

// const screenHeight = Dimensions.get('window').height;


/**
 * 样式屏幕适配器
 */
class StyleSheetScreenAdapter {

    private designWidth: number;

    private designHeight: number;

    private rpx: number;

    constructor() {
        this.designSize()
    }

    /**
     * 设置设计尺寸
     * @param designWidth   默认 750
     * @param designHeight  默认 1344
     */
    public designSize = (designWidth: number = 750, designHeight: number = 1344) => {
        this.designWidth = designWidth;
        this.designHeight = designHeight;
        this.rpx = screenWidth / designWidth;
    };

    /**
     * 尺寸缩放
     * @param uiDesignSizePx ui设计尺寸
     */
    public scalePx2dp = (uiDesignSizePx: number) => {

        return uiDesignSizePx * this.rpx;
    }
}

export default new StyleSheetScreenAdapter();
