import {File} from "@babel/types";

export interface MetadataType {

    file: File;

    filepath: string
}

export interface TypeFilter {


    match: (metadata: MetadataType,) => boolean;
}
