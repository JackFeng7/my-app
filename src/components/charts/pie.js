import React, {PureComponent} from 'react';
import { Pie } from '@ant-design/charts';
import {Empty} from 'antd';

export default class LineChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state={};
        this.statics = ['收入', '支出'];
    }

    render() {
        const {pieData} = this.props;
        if (!pieData || !Object.keys(pieData).length) {
            return <Empty/>
        }
        const keys = Object.keys(pieData);
        const data = [];
        const totalData = []
        keys.forEach((key) => {
            if (!this.statics.includes(key)) {
                data.push({
                    type: key.trim(),
                    value: pieData[key],
                });
            } else {
                totalData.push({
                    type: key.trim(),
                    value: pieData[key],
                });
            }
        });
        const config = {
            appendPadding: 10,
            data,
            angleField: 'value',
            colorField: 'type',
            radius: 1,
            innerRadius: 0.64,
            meta: {
              value: {
                formatter: function formatter(v) {
                  return ''.concat(v, ' \xA5');
                },
              },
            },
            label: {
              type: 'inner',
              offset: '-50%',
              style: { textAlign: 'center', fill: '#666'},
              autoRotate: false,
              content: '{name}:{percentage}',
            },
            interactions: [
              { type: 'element-selected', enable: false },
              { type: 'element-active' },
              { type: 'pie-statistic-active'},
              { type: 'tooltip'}
            ],
            statistic: {
                title: false,
                content: {
                  style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: 20,
                  },
                  formatter: (element) => {
                    return `${element.type}\n¥${element.value.toFixed(2)} | ${(element.value/pieData['支出'] * 100).toFixed(2)}%`;
                  },
                  customHtml: () => {
                      let str = ''
                      totalData.forEach((item) => {
                          str += `${item.type}：${item.value.toFixed(2)}\n`;
                      });
                    str += `净收入：${(totalData[1].value - totalData[0].value).toFixed(2)}`
                      return str;
                  }
                },
            },
            tooltip: {
                formatter: (datum) => {
                  return { name: datum.type, value: `¥${datum.value.toFixed(2)} | ${(datum.value/pieData['支出'] * 100).toFixed(2)}%`};
                },
              }
          };
          return <Pie {...config} />;
    }
}
