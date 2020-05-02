import React from 'react';
import {RouteView} from 'fengwuxp-routing-core';
import {AntdRouteViewOptions} from 'fengwuxp-routing-antd';
import {ModalProps} from 'antd/lib/modal/Modal';
import {createFormActions, FormButtonGroup, Reset, SchemaForm, SchemaMarkupField as Field, Submit,} from '@formily/antd'

import {Card} from 'antd'
import ExampleService from '@/feign/example/services/ExampleService';
import {UPLOAD_FILE_URL} from "@/env/EnvVariableConfiguration";
import {Week} from "@/feign/enums/Week";

export interface CreateExampleViewProps {

}

interface CreateExampleViewState {

    submitting: boolean;
}

const actions = createFormActions();


/**
 * 创建 example
 */
@RouteView<AntdRouteViewOptions & ModalProps>({
    // showMode: ViewShowMode.DIALOG,
    pageHeader: {
        title: "标题",
        content: 'example 创建',
    }
})
export default class CreateExampleView extends React.PureComponent<CreateExampleViewProps, CreateExampleViewState> {

    state: CreateExampleViewState = {
        submitting: false
    }

    constructor(props: CreateExampleViewProps, context: any) {
        super(props, context);
    }

    componentDidMount(): void {

    }

    render = () => {
        const {submitting} = this.state;
        return <Card bordered={false}>
            <SchemaForm
                onSubmit={this.submit}
                actions={actions}
                labelCol={{span: 7}}
                initialValues={{
                    name: "张三",
                    age: 10
                }}
                wrapperCol={{span: 12}}
                onValidateFailed={results => {
                    console.log('results', results);
                }}

                effects={($, {setFieldState}) => {
                    $('onFormMount').subscribe(() => {
                        setFieldState('radio', state => {
                            state.required = true
                        })
                    })
                }}
            >

                <Field
                    type="string"
                    x-props={{
                        placeholder: "请输入姓名",
                        prefix: "123"
                    }}
                    title="姓名"
                    description={"用户真实姓名，长度2-10个字符"}
                    maxLength={10}
                    minLength={2}
                    name="name"
                    required
                />
                <Field
                    type="number"
                    x-props={{
                        placeholder: "请输入年龄"
                    }}
                    maximum={200}
                    minimum={1}
                    title="年龄"
                    name="age"
                    required
                />
                <Field
                    type="upload"
                    title="上传头像"
                    name="upload2"
                    x-props={{
                        listType: 'dragger',
                        action: UPLOAD_FILE_URL /*上传文件的地址*/
                    }}
                />
                <Field
                    type="number"
                    x-props={{
                        placeholder: "请输入账号余额",
                        prefix: "￥"
                    }}
                    title="账号余额"
                    name="money"
                    required
                />

                <Field type="date" title="生日" name="birthday" format={"yyyy年MM月dd日"}/>
                <Field type="boolean" title="是否启用" name="enable"/>
                <Field
                    type="string"
                    enum={Object.keys(Week).map((key) => {
                        const weekElement = Week[key];
                        return {
                            label: weekElement.desc,
                            value: weekElement.name
                        };
                    })}
                    required
                    title="Select"
                    name="week"
                    x-props={{style: {maxWidth: 300}}}
                />

                <Field
                    type="number"
                    x-props={{
                        placeholder: "请输入排序"
                    }}
                    minimum={1}
                    title="排序"
                    name="orderCode"
                />

                <FormButtonGroup offset={7} sticky>
                    <Submit htmlType="button" loading={submitting}/>
                    <Reset/>
                </FormButtonGroup>
            </SchemaForm>
        </Card>
    };

    private submit = (values) => {
        this.setState({
            submitting: true
        });
        console.log("提交数据", values);
        ExampleService.create(values).then(() => {

        }).finally(() => {
            this.setState({
                submitting: false
            })
        });
    }
}
