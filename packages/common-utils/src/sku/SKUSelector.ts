export interface Sku {
    id: string | number;

    // 价格
    price: number;

    // 库存
    stock: number;

    // 主图
    mainImage: string;

    // 是否启用
    enabled?: boolean;

    // sku 属性列表
    attributes: SkuAttribute[];
}

export interface SkuAttribute {

    // sku 属性名称
    name: string;

    // sku 属性值
    value: string;
}

export type SelectResult<T extends Sku> = {

    /**
     * 选中的sku
     */
    sku?: T;

    /**
     * 选中的规格属性
     */
    selected: Array<SkuAttribute>;

    /*
    * 激活的的规格属性
    * */
    active: Array<SkuAttribute[]>;
};

export interface SkuAttributeValue {
    name: string;
    values: string[];
}

export interface SKUSelector<T extends Sku = Sku> {


    /**
     * 设置默认选中的sku
     * @param sku
     */
    setSelectedSku: (sku: T | number) => Promise<SelectResult<T>>;

    /**
     * 选中sku属性
     * @param attribute
     */
    onSelected: (attribute: SkuAttribute) => Promise<SelectResult<T>>;

    /**
     * 获取sku 属性列表
     */
    getSkuAttributeValues: () => Array<SkuAttributeValue>;
}
