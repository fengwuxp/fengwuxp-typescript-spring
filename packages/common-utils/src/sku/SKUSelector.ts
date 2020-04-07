export type SKUItemKey = string;

export interface SKUItemValue {

    id: string | number;

    // 价格
    price: number;

    // 库存
    stock: number;

    // 是否启用
    enabled?: boolean;
}

export type SKU<V extends SKUItemValue> = Record<SKUItemKey, V>

// 规格值
export type SpecificationValueItem = {

    // 规格名称
    specification: string;

    // 规格值
    value: string;

    // 规格属性的排序
    specificationIndex?: number;

    // 规格值的排序
    valueIndex?: number;
}

export type SelectResult<V extends SKUItemValue> = {

    /**
     * 选中的sku
     */
    sku?: V;

    /**
     * 选中的规格属性值
     */
    selected: Array<SpecificationValueItem>;

    /*
    * 无效的规格属性值
    * */
    invalid: Array<SpecificationValueItem>;
}

export enum ExpectAction {
    // 选中
    SELECTED,

    // 移除
    REMOVE,

    // 禁用
    DISABLED
}

/**
 * sku 选择器
 */
export interface SKUSelector<V extends SKUItemValue = SKUItemValue> {

    /**
     * 选中一个规格
     * @param    value   规格值
     * @return   当前选中的规格值以及和当前选中规格组合库存不足的规格
     */
    selected: (value: SpecificationValueItem) => Promise<SelectResult<V>>;

    /**
     * 移除一个规格的选中
     * @param    value   规格值
     * @return   当前选中的规格值以及和当前选中规格组合库存不足的规格
     */
    remove: (value: SpecificationValueItem) => Promise<SelectResult<V>>;

    /**
     * 点击一个规格
     * @param value 规格值
     * @return   当前选中的规格值以及和当前选中规格组合库存不足的规格
     */
    onClick: (value: SpecificationValueItem) => Promise<SelectResult<V>>;

    /**
     * 选中一个规格商品
     * @param values
     */
    selectedSku: (values: SpecificationValueItem[]) => Promise<SelectResult<V>>;

    /**
     * 随机选中一个
     *  @return
     */
    randomSelectedSku: () => Promise<SelectResult<V>>

    /**
     * 移除所有选中，并还原初始状态
     */
    clear: () => void;
}







