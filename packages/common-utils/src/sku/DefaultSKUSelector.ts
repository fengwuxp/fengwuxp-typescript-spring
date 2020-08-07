import {SelectResult, Sku, SkuAttribute, SkuAttributeValue, SKUSelector} from "./SKUSelector";


export default class DefaultSKUSelector<T extends Sku = Sku> implements SKUSelector<T> {

    private skuList: T[];

    private selectedAttributes: SkuAttribute[] = [];

    // 激活规格属性
    private activeAttributes: Array<SkuAttribute[]> = [];

    private skuValues: Array<SkuAttributeValue>;

    constructor(skuList: T[], skuValues: Array<SkuAttributeValue>) {
        this.skuList = skuList;
        this.skuValues = skuValues;
        this.init();
    }

    setSelectedSku(sku: T | number): Promise<SelectResult<T>> {

        const {activeAttributes, skuList} = this;
        if (typeof sku === "number") {
            sku = skuList.find((item) => item.id === sku);
            if (this.isInventoryShortage(sku)) {
                sku = skuList.find((item) => !this.isInventoryShortage(item));
            }

        }
        if (sku != null) {
            this.selectedAttributes = [...sku.attributes];
        }
        this.clearActiveAttributes();
        this.optionLayoutEnableStatus();
        return Promise.resolve({
            sku: this.getSelectedSku(),
            selected: this.selectedAttributes,
            active: activeAttributes
        });
    }


    getSkuAttributeValues = () => this.skuValues;


    onSelected(attribute: SkuAttribute): Promise<SelectResult<T>> {

        const {activeAttributes, selectedAttributes, skuValues} = this;
        let rowIndex = selectedAttributes.findIndex(item => isSameSkuAttribute(item, attribute));

        if (rowIndex >= 0) {
            // 已选中，去选
            selectedAttributes[rowIndex] = null;
        } else {
            // 为选中，选中
            rowIndex = skuValues.findIndex((item) => item.name === attribute.name);
            selectedAttributes[rowIndex] = attribute;
        }
        this.clearActiveAttributes();
        this.optionLayoutEnableStatus();

        return Promise.resolve({
            sku: this.getSelectedSku(),
            selected: selectedAttributes,
            active: activeAttributes
        });
    }


    private init = () => {
        const {skuList, selectedAttributes, activeAttributes, skuValues} = this;
        this.clearActiveAttributes();
        if (skuList.length === 1) {
            selectedAttributes.push(...skuList[0].attributes);
        }
        if (skuValues.length === 1) {
            //只有一个规格属性，禁用掉无库存的sku
            for (let sku of skuList) {
                if (!this.isInventoryShortage(sku)) {
                    activeAttributes[0].push(...sku.attributes)
                }
            }
        }
    }

    /**
     * 标记sku的可用状态
     */
    private optionLayoutEnableStatus = () => {
        if (this.skuValues.length === 1) {
            this.optionLayoutEnableStatusSingleProperty();
        } else {
            this.optionLayoutEnableStatusMultipleProperties();
        }
    }

    /**
     * 只有单个规格属性时
     */
    private optionLayoutEnableStatusSingleProperty = () => {
        const {skuList, activeAttributes} = this;
        for (let sku of skuList) {
            const skuAttributes = sku.attributes;
            // if (isSameSkuAttribute(selectedAttributes[0], skuAttributes[0])) {
            //     if (!this.isInventoryShortage(sku)) {
            //         activeAttributes[0].push(...skuAttributes);
            //     }
            // }
            if (!this.isInventoryShortage(sku)) {
                activeAttributes[0].push(...skuAttributes);
            }
        }
    }

    /**
     * 有多个规格属性时
     */
    private optionLayoutEnableStatusMultipleProperties = () => {

        const {skuList, selectedAttributes, skuValues, activeAttributes} = this;
        skuValues.forEach((_, index) => {
            skuList.forEach((sku, j) => {
                const attributes = sku.attributes;
                // 遍历选中信息列表
                // 属性值是否可点击flag
                const flag = selectedAttributes.some((selectedValue, k) => {
                    // index = k，跳过当前属性，避免多次设置是否可点击
                    if (index === k) {
                        return false;
                    }
                    // 选中信息为空，则说明未选中，无法判断是否有不可点击的情形，跳过
                    if (selectedValue == null) {
                        return false;
                    }
                    // 选中信息列表中不包含当前sku的属性，则sku组合不存在，设置为不可点击或库存为0，设置为不可点击
                    // console.log("selectedValue.value !== attributes[k].value ", selectedValue, attributes[k], k)
                    return selectedValue.value !== attributes[k].value || this.isInventoryShortage(sku);
                });
                // flag 为false时，可点击
                // console.log("===========>", flag, attributes);
                if (!flag) {
                    const skuAttribute = attributes[index];
                    const items = skuValues[index].values.filter((item) => {
                        return skuAttribute.value == item
                    }).map((value) => {
                        return {
                            name: skuAttribute.name,
                            value
                        }
                    });
                    activeAttributes[index].push(...items);
                    console.log("可以点击的==>", items, skuAttribute, index, skuValues[index].values);
                }
            })

        })

    }

    /**
     * 是否库存不足
     * @param val
     */
    protected isInventoryShortage = (val: T) => {

        if (val && val.enabled != null && val && val.enabled === false) {
            return true;
        }
        return val && val.stock <= 0;
    };

    /**
     * sku 是否全部选中
     */
    private isSkuSelected = () => {
        const {selectedAttributes} = this;
        return selectedAttributes.some(attribute => attribute == null);
    }

    /**
     * 获取选中的sku
     */
    private getSelectedSku = (): T => {
        if (!this.isSkuSelected() == null) {
            return null;
        }
        const {selectedAttributes, skuList} = this;
        for (let sku of skuList) {
            let skuAttributes = sku.attributes;
            let result = true;
            for (let i = 0; i < skuAttributes.length; i++) {
                if (!isSameSkuAttribute(skuAttributes[i], selectedAttributes[i])) {
                    result = false;
                }
            }
            if (result) {
                return sku;
            }

        }
        return null;
    }


    /**
     * 清除可选的状态
     */
    private clearActiveAttributes = () => {
        const {activeAttributes, skuValues} = this;
        skuValues.forEach((_, index) => {
            activeAttributes[index] = [];
        });

    }
}

/**
 * 是否为同一个sku 属性
 * @param attribute1
 * @param attribute2
 */
export const isSameSkuAttribute = (attribute1: SkuAttribute, attribute2: SkuAttribute,) => {
    if (attribute1 == null || attribute2 == null) {
        return false;
    }

    return attribute1.name == attribute2.name && attribute1.value == attribute2.value;
}
