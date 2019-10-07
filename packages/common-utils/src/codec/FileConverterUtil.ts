export const base64ToFile = (base64: string, mime = 'image/jpeg'): Blob => {
    const byteString = window.atob(base64);
    const content = [];
    for (let i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i)
    }
    return new window.Blob([new Uint8Array(content)], {type: mime})
};

export const base64ToBlob = (base64: string): Blob => {
    let arr = base64.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
};

/**
 * 文件对象或 Blob对象转换为base64字符串
 * @param file
 */
export const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (evt) => {
            // @ts-ignore
            resolve(evt.target.result);
        }, false);

        fileReader.addEventListener('error', (err) => {
            reject(err)
        }, false);

        fileReader.readAsDataURL(file);
    })
};

export const canvasToBase64 = (canvas, quality?: number) => {
    // in order to compress the final image format has to be jpeg
    return canvas.toDataURL('image/jpeg', quality || 1)
};

// base64转canvas
export const base64ToCanvas = (base64: string): Promise<HTMLCanvasElement> => {
    const canvas: HTMLCanvasElement = document.createElement('CANVAS') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = base64;
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        };

        img.onerror = function (event: Event | string, source?: string, fileno?: number, columnNumber?: number, error?: Error) {
            reject(event);
        }
    });
};





