import {ResourceLoader} from "./ResourceLoader";
import {FileSystemResource} from "./FileSystemResource";


export default class FileSystemResourceLoader implements ResourceLoader {


    getResource = (location: string) => {

        const fileSystemResource = new FileSystemResource(location);
        if (!fileSystemResource.exists()) {
            return null;
        }
        return fileSystemResource;
    };


}
