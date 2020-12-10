import {OpenApiCodegenOptions} from "./OpenApiCodegenOptions";

export interface OpenApiCodegenOptionsAware {

    setOpenApiCodegenOptions: (options:OpenApiCodegenOptions) => void;
}

export const CodegenOptionsAware = () => {

}