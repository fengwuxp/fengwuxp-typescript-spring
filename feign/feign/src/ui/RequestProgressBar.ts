


/**
 * 请求进度条配置
 */
export interface ProgressBarOptions {


    /**
     * 是否使用蒙版
     */
    mask?: boolean;

    /**
     * 提示的延迟时间，
     * 单位毫秒，默认：300
     */
    delay?: number;

    /**
     * 进度条提示标题
     */
    title?: string;

    /**
     * 进度条提示图标
     * 图标，字体图标名称或图片url
     */
    icon?: string;
}

/**
 * process bar
 */
export interface RequestProgressBar<T extends ProgressBarOptions = ProgressBarOptions> {

    showProgressBar: (progressBarOptions?: T) => void;

    hideProgressBar: () => void;

}
