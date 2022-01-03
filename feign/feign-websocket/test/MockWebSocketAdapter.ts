import {WebSocketAdapter} from "../src/WebSocketAdapter";


export default class MockWebSocketAdapter implements WebSocketAdapter {


    close = (code: number | undefined, reason: string | undefined): void => {

    }

    onClose = (event: any): void => {
    }

    onError = (event: any): void => {
    }

    onMessage = (data: string | ArrayBufferLike | Blob | ArrayBufferView): void => {
    }

    onOpen = (event: any): void => {
    }

    send = (data: string | ArrayBufferLike | Blob | ArrayBufferView): void => {
    }


}