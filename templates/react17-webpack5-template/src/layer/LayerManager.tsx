import {ModalProps} from "antd/es/modal";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Modal} from "antd";


const destroyFns: Array<() => void> = [];
const IS_REACT_16 = !!ReactDOM.createPortal;

export default function open(config: ModalProps & { children: React.ReactNode }) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    // eslint-disable-next-line no-use-before-define
    let currentConfig = {...config, close, visible: true} as any;

    function destroy(...args: any[]) {
        const unmountResult = ReactDOM.unmountComponentAtNode(div);
        if (unmountResult && div.parentNode) {
            div.parentNode.removeChild(div);
        }
        const triggerCancel = args.some(param => param && param.triggerCancel);
        if (config.onCancel && triggerCancel) {
            // @ts-ignore
            config.onCancel(...args);
        }
        for (let i = 0; i < destroyFns.length; i++) {
            const fn = destroyFns[i];
            // eslint-disable-next-line no-use-before-define
            if (fn === close) {
                destroyFns.splice(i, 1);
                break;
            }
        }
    }


    function render(props: any) {
        ReactDOM.render(<Modal getContainer={false}
        style={{paddingBottom: 0}}
        {...props} />, div);
    }

    function close(...args: any[]) {
        currentConfig = {
            ...currentConfig,
            visible: false,
            // @ts-ignore
            afterClose: destroy.bind(this, ...args),
        };
        if (IS_REACT_16) {
            render(currentConfig);
        } else {
            destroy(...args);
        }
    }

    function update(newConfig: Partial<ModalProps>) {
        currentConfig = {
            ...currentConfig,
            ...newConfig,
        };
        render(currentConfig);
    }

    render(currentConfig);

    destroyFns.push(close);

    return {
        destroy: close,
        update,
    };
}
