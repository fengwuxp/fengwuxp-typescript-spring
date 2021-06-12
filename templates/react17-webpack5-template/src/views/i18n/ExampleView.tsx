import React from "react"
import {Select} from "antd";
import {Trans, Translation, useTranslation} from 'react-i18next'
import I18nText from "@/components/i18n";

export interface I18nExampleViewProps {

}

const Option = Select.Option;

const I18nExampleView = (props: I18nExampleViewProps) => {

    const {t, i18n} = useTranslation()
    console.log("i18n", i18n);

    return (
        <div>
            <div>
                <Select defaultValue={"zh-CN"} onChange={(value, option) => {
                    console.log("==语言切换=>", value);
                    i18n.changeLanguage(value as string).then((_) => {
                        console.log("==切换成功=>");
                    });
                }}>
                    {
                        ["en-US", "zh-CN"].map((item) => {
                            return <Option key={item} value={item}>{item}</Option>
                        })
                    }
                </Select>
            </div>
            {/* 3种常用使用方式 */}
            <h1>{t('home')}</h1>
            <h1><I18nText name={"home"} defaultValue={"test"}/></h1>
            <h1><I18nText name={"test.key"} defaultValue={"test-default"}/></h1>
            <h2><Trans>home</Trans></h2>
            <Translation>{t => <h3>{t('home')}</h3>}</Translation>
        </div>
    )
}

export default I18nExampleView;
