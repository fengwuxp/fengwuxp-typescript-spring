import {ScannerOptions} from "../SpringScanner";

/**
 * 文件路径转换规则
 */
export interface FilePathTransformStrategy {

    /**
     * @param scannerOptions
     * @return 要扫描的文件路径
     */
    transform: (scannerOptions: ScannerOptions) => string[];
}