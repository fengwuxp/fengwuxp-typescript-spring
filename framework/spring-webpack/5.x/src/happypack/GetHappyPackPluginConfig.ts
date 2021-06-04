import * as os from "os";
import  HappyPack from "happypack";


/**
 * 生成 happyPack loader的字符串描述
 * @param id
 */
export const genHappyPackLoaderString = (id: string) => {

    return `happypack/loader?id=${id}`
};

export const getHappyPackPlugin = (id: string, loaders: Array<any>, threads: number = os.cpus().length - 1) => {

    return new HappyPack({
        id,
        loaders,
        threads
    });

};