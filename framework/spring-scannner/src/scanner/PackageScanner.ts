/**
 * package scanner
 */
export interface PackageScanner<T = any> {

    /**
     * scan paths
     * @param paths
     */
    scan: (paths: string[]) => T;
}