import React from 'react';
import {RouteView} from 'fengwuxp-routing-core';
import {AntdRouteViewOptions} from 'fengwuxp-routing-antd';
import {ModalProps} from 'antd/lib/modal/Modal';
import {createFormActions, Field, FormButtonGroup, Reset, SchemaForm, Submit,} from '@formily/antd'

import {Button, Card} from 'antd'

export interface CreateDemoViewProps {

}

interface CreateDemoViewState {

}

const actions = createFormActions();

/**
 * 创建 demo
 */
@RouteView<AntdRouteViewOptions & ModalProps>({
  // showMode: ViewShowMode.DIALOG,
  pageHeader: {
    content: 'demo 创建',
  }
})
export default class CreateDemoView extends React.Component<CreateDemoViewProps, CreateDemoViewState> {


  constructor(props: CreateDemoViewProps, context: any) {
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

        <Field
          type="string"
          enum={['1', '2', '3', '4']}
          required
          title="Select"
          name="select"
          x-props={{style: {maxWidth: 300}}}
        />
        <Field
          type="checkbox"
          enum={['1', '2', '3', '4']}
          required
          title="Checkbox"
          name="checkbox"
        />
        <Field
          type="string"
          title="TextArea"
          name="textarea"
          x-component="textarea"
        />
        <Field type="number" title="数字选择" name="number"/>
        <Field type="boolean" title="开关选择" name="boolean"/>
        <Field type="date" title="日期选择" name="date"/>
        <Field
          type="daterange"
          title="日期范围"
          default={['2018-12-19', '2018-12-19']}
          name="daterange"
        />
        <Field type="year" title="年份" name="year"/>
        <Field type="week" title="周" name="week"/>
        <Field
          type="week"
          title="周(自定义显示格式)"
          name="week1"
          format="gggg年 第w周"
        />
        <Field type="time" title="时间" name="time"/>
        <Field
          type="upload"
          title="卡片上传文件"
          name="upload"
          x-props={{
            listType: 'card',
          }}
        />
        <Field
          type="upload"
          title="拖拽上传文件"
          name="upload2"
          x-props={{listType: 'dragger'}}
        />
        <Field
          type="upload"
          title="普通上传文件"
          name="upload3"
          x-props={{listType: 'text'}}
        />
        <Field
          type="range"
          title="范围选择"
          name="range"
          x-props={{min: 0, max: 1024, marks: [0, 1024]}}
        />
        <Field
          type="transfer"
          enum={[{key: 1, title: '选项1'}, {key: 2, title: '选项2'}]}
          x-props={{render: item => item.title}}
          title="穿梭框"
          name="transfer"
        />
        <Field type="rating" title="等级" name="rating"/>
        <FormButtonGroup offset={7} sticky>
          <Submit htmlType="button"/>
          <Reset/>
          <Button
            onClick={() => {
              actions.setFieldState('upload', state => {
                state.value = [
                  {
                    downloadURL:
                      '//img.alicdn.com/tfs/TB1n8jfr1uSBuNjy1XcXXcYjFXa-200-200.png',
                    imgURL:
                      '//img.alicdn.com/tfs/TB1n8jfr1uSBuNjy1XcXXcYjFXa-200-200.png',
                    name: 'doc.svg',
                  },
                ]
              })
            }}
          >
            上传文件
          </Button>
          <Button
            onClick={() => {
              actions.setFormState(state => {
                state.values = {
                  radio: '4',
                  checkbox: ['2', '3'],
                }
              })
            }}
          >
            改变radio的值
          </Button>
        </FormButtonGroup>
      </SchemaForm>
    </Card>
  };

  private submit = (values) => {

  }
}
