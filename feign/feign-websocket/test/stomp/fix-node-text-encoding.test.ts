import {TextDecoder, TextEncoder} from "text-encoding";

// hack text-encoding
if (typeof global.TextDecoder === "undefined") {
    global['TextDecoder'] = TextDecoder
    global['TextEncoder'] = TextEncoder
}
