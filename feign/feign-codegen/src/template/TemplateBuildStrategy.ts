/**
 * 模板构建策略
 */
export interface TemplateBuildStrategy<T> {

    /**
     * 通过模板构建出内容
     * @param data
     */
    build: (data: T) => void
}

/**
 * 模板输出策略
 */
export interface TemplateOutputStrategy<T> {

    /**
     * 计算模板渲染后的输出路径
     *
     * @param renderData 模板用于渲染的数据
     * @param templateName  模板名称
     * @param renderResult 模板处理的结果
     * @return 输出路径
     */
    output: (renderData: T, templateName: string, renderResult: string) => string;
}