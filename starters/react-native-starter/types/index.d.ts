/**
 * 样式屏幕适配器
 */
declare class StyleSheetScreenAdapter {
    private designWidth;
    private designHeight;
    private rpx;
    constructor();
    /**
     * 设置设计尺寸
     * @param designWidth   默认 750
     * @param designHeight  默认 1344
     */
    designSize: (designWidth?: number, designHeight?: number) => void;
    /**
     * 尺寸缩放
     * @param uiDesignSizePx ui设计尺寸
     */
    scalePx2dp: (uiDesignSizePx: number) => number;
}
declare const _default: StyleSheetScreenAdapter;

export { _default as StyleSheetScreenAdapter };
