// const HIDE_MOBILE_PHONE_REGEXP: RegExp = /^(\d{3})\d{4}(\d{4})$/;
// const HIDE_ID_NUMBER_REGEXP: RegExp = /^(\d{10})\d{4}(\w{4})$/;

/**
 * 隐藏手机号码中间4位数
 * @param {string} mobilePhone
 * @return {string}
 */
export const hideMobilePhone = (mobilePhone: string): string => {
    if (mobilePhone == null) {
        return null;
    }
    const s = mobilePhone.trim();
    if (s.length < 11) {
        return mobilePhone;
    }
    return commonHideString(mobilePhone, {
        header: 3,
        hideNum: 4,
        footer: 4
    });
};


/**
 * 隐藏身份证号码生日4位数
 * @param {string} idNumber
 * @param {HideOptions} hideOptions
 * @return {string}
 */
export const hideIdNumber = (idNumber: string, hideOptions: HideOptions = {
    hideNum: 4,
    header: 10,
    footer: 4
}): string => {
    if (idNumber == null) {
        return null;
    }
    const s = idNumber.trim();
    if (s.length < 18) {
        return idNumber;
    }
    return commonHideString(idNumber, hideOptions);
};

interface HideOptions {
    /**
     * 隐藏的位数
     */
    hideNum: number,
    /**
     * 头部保留
     */
    header: number,

    /**
     * 尾部保留
     */
    footer: number
}

/**
 * 通用的隐藏字符串处理
 * @param str
 * @param hideOptions
 */
export const commonHideString = (str: string, hideOptions: HideOptions) => {
    if (str == null) {
        return null;
    }
    const s = str.toString().trim();

    const regExp = new RegExp(`^(\\d{${hideOptions.header}})\\d{${hideOptions.hideNum}}(\\w{${hideOptions.footer}})$`);


    const replaceString = ["$1"];

    for (let i = 0; i < hideOptions.hideNum; i++) {
        replaceString.push("*");
    }
    replaceString.push("$2");
    return s.replace(regExp, replaceString.join(""));
};


