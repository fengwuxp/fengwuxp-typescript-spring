import React from 'react';
import {RouteView} from 'fengwuxp-routing-core';
import {AntdRouteViewOptions} from 'fengwuxp-routing-antd';
import {ModalProps} from 'antd/lib/modal/Modal';
import {
  SchemaForm,
  Field,
  FormButtonGroup,
  Submit,
  Reset,
  createFormActions,
} from '@uform/antd/esm'

import {Card} from 'antd'
import ExampleService from '@/feign/example/services/ExampleService';

export interface CreateExampleViewProps {

}

interface CreateExampleViewState {

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
export default class CreateExampleView extends React.Component<CreateExampleViewProps, CreateExampleViewState> {


  constructor(props: CreateExampleViewProps, context: any) {
    super(props, context);
  }

  render = () => {
    return <Card bordered={false}>
      <SchemaForm
        onSubmit={this.submit}
        actions={actions}
        labelCol={{span: 7}}
        initialValues={{
          upload3: [{
            downloadURL:
              '//img.alicdn.com/tfs/TB1n8jfr1uSBuNjy1XcXXcYjFXa-200-200.png',
            imgURL:
              '//img.alicdn.com/tfs/TB1n8jfr1uSBuNjy1XcXXcYjFXa-200-200.png',
            name: 'doc.svg',
          }],
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
          type="radio"
          enum={['1', '2', '3', '4']}
          title="Radio"
          name="radio"
        />


        <FormButtonGroup offset={7} sticky>
          <Submit htmlType="button"/>
          <Reset/>
        </FormButtonGroup>
      </SchemaForm>
    </Card>
  };

  private submit = (values) => {

    console.log("提交数据", values);
    ExampleService.create(values).then(() => {

    }).catch(() => {

    })
  }
}
