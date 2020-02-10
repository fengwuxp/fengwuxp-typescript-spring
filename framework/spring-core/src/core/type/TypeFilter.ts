import {File} from "@babel/types";

export interface MetadataType {

    filepath: string;

    file?: File;
}

export interface TypeFilter {


    match: (metadata: MetadataType,) => boolean;
}
