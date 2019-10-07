interface PositionCoordinates {
    /**
     * 纬度
     */
    latitude: number;

    /**
     * 精度
     */
    longitude: number;
}

/**
 * 计算2个经纬度之间的距离
 * @param start 起始坐标
 * @param end   结束坐标
 * @return 返回的距离单位为KM
 */
export const calculationDistance = (start: PositionCoordinates, end: PositionCoordinates): number => {
    const radLat1 = start.latitude * Math.PI / 180.0;
    const radLat2 = end.latitude * Math.PI / 180.0;
    const a = radLat1 - radLat2;

    const b = start.longitude * Math.PI / 180.0 - end.longitude * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    // EARTH_RADIUS;
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    return s;
};
