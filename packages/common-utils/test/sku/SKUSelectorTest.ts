import * as log4js from "log4js";
import DefaultSKUSelector from "../../src/sku/DefaultSKUSelector";
import {Sku} from "../../src/sku/SKUSelector";


const logger = log4js.getLogger();
logger.level = 'debug';

describe("sku select", () => {

    const sku: Sku[] = [
        {
            id: 1,
            enabled: true,
            mainImage: "",
            price: 1,
            stock: 10,
            attributes: [
                {
                    name: "颜色",
                    value: "白色"
                },
                {
                    name: "内存",
                    value: "4G"
                },
                {
                    name: "运营商",
                    value: "电信"
                }
            ]
        },
        {
            id: 2,
            enabled: true,
            mainImage: "",
            price: 2,
            stock: 1,
            attributes: [
                {
                    name: "颜色",
                    value: "黑色"
                },
                {
                    name: "内存",
                    value: "4G"
                },
                {
                    name: "运营商",
                    value: "电信"
                }
            ]
        },
        {
            id: 3,
            enabled: true,
            mainImage: "",
            price: 3,
            stock: 3,
            attributes: [
                {
                    name: "颜色",
                    value: "银色"
                },
                {
                    name: "内存",
                    value: "4G"
                },
                {
                    name: "运营商",
                    value: "电信"
                }
            ]
        }
    ];


    test("test default sku selector", async () => {


        const defaultSKUSelector = new DefaultSKUSelector(sku, [
            {
                name: "颜色",
                values: ["白色", "黑色", "银色"]
            },
            {
                name: "内存",
                values: ["4G", "6G", "8G"]
            },
            {
                name: "运营商",
                values: ["电信", "移动", "联通"]
            }
        ]);

        await defaultSKUSelector.onSelected(
            {
                name: "颜色",
                value: "银色"
            }
        ).then((result) => {
            logger.debug("选中结果", result);
        });


        await defaultSKUSelector.onSelected(
            {
                name: "内存",
                value: "4G"
            }).then((result) => {
            logger.debug("选中结果==>2", result);
        });

        await defaultSKUSelector.onSelected(
            {
                name: "运营商",
                value: "电信"
            }).then((result) => {
            logger.debug("选中结果==>3", result);
        });
    }, 10 * 1000)

});

