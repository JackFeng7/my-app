import React, {PureComponent} from 'react';
import { Pie } from '@ant-design/charts';
import {Empty} from 'antd';

export default class LineChart extends PureComponent {
  constructor(props) {
      super(props);
      this.state={};
      this.statics = ['收入', '支出'];
  }


  // 饼状图格式化格式化数据
  formatPieData = (pieData) => {
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

    return {data, totalData};
  };

  // 格式化tooltip 数据
  formatTooltip = (datum, pieData) => {
    return { name: datum.type, value: `¥${datum.value.toFixed(2)} | ${(datum.value/pieData['支出'] * 100).toFixed(2)}%`};
  };

  // 自定义statistic HTML
  customHtmlOfStatistic = (totalData) => {
    let str = ''
    totalData.forEach((item) => {
        str += `${item.type}：${item.value.toFixed(2)}\n`;
    });
    str += `净收入：${(totalData[1].value - totalData[0].value).toFixed(2)}`
      return str;
  }

  // 格式化statistic 数据
  formatStatistic = (element, pieData) => {
    return `${element.type}\n¥${element.value.toFixed(2)} | ${(element.value/pieData['支出'] * 100).toFixed(2)}%`;
  };

  // 获取pieChart config
  getPieConfig = () => {
    const {pieData} = this.props;
    const {data, totalData} = this.formatPieData(pieData);
    return {
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
            formatter: (element) => this.formatStatistic(element, pieData),
            customHtml: () => this.customHtmlOfStatistic(totalData),
          },
      },
      tooltip: {
          formatter: (datum) => this.formatTooltip(datum, pieData),
        }
    };
  };

  render() {
      const {pieData} = this.props;
      if (!pieData || !Object.keys(pieData).length) {
          return <Empty/>
      }

      const pieConfig = this.getPieConfig();
      return <Pie {...pieConfig} />;
  }
}
