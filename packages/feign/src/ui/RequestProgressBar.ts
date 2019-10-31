import {ProgressBarOptions} from "../FeignRequestOptions";

/**
 * process bar
 */
export interface RequestProgressBar {

    showProgressBar: (progressBarOptions?: ProgressBarOptions) => void;

    hideProgressBar: () => void;

}
