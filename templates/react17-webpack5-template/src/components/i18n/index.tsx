import {useTranslation} from "react-i18next";
import React from "react";

export interface I18nTextProps {
    name: TranslationKey;
    defaultValue?: string
}

const I18nText: React.FC<I18nTextProps> = ({name, defaultValue}: I18nTextProps) => {
    const {t} = useTranslation()
    return <>
        {t(name, defaultValue)}
    </>;
}
export default I18nText;
