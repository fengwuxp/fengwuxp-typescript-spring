/**
 * code generator
 * @author wxup
 */
export interface CodeGenerator {

    /**
     * 生成
     */
    generate: () => Promise<void> | void;
}