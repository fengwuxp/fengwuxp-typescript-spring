import {OpenApiCodegenOptions} from '../OpenApiCodegenOptions';

const ZONE_OPTIONS_KEY = "__ZONE_OPTIONS__";
let nameIndex = 0;

export const forkAndSetOptionsToZone = (options: OpenApiCodegenOptions) => {

    Zone.current.fork({
        name: `zone_${nameIndex++}`,
        properties: options
    })
}

export const getCurrentOptions = (): OpenApiCodegenOptions => {

    return Zone.current.get(ZONE_OPTIONS_KEY)
}