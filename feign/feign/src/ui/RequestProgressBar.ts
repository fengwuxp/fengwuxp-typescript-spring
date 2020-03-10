import {ProgressBarOptions} from "../FeignRequestOptions";

/**
 * process bar
 */
export interface RequestProgressBar<T extends ProgressBarOptions = ProgressBarOptions> {

    showProgressBar: (progressBarOptions?: T) => void;

    hideProgressBar: () => void;

}
