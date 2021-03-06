import React, {PureComponent} from 'react';
import { Line } from '@ant-design/charts';
import {Empty} from 'antd';
import moment from 'moment';

export default class LineChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state={};
    }

    render() {
      const {total} = this.props;
        if (!this.props.data.length){
            return (
              <Empty />
            );
        }

        const currentYear = moment().get('year');
        const currentYearStart = moment([currentYear, 0, 1]).valueOf();
        const currentYearEnd = moment([currentYear + 1, 0, 1]).valueOf() - 1;
        const currentTime = moment().valueOf();

        const percent = Math.ceil((currentTime - currentYearStart) / (currentYearEnd - currentYearStart) * 100) / 100;
        const config = {
            data: this.props.data,
            xField: 'date',
            yField: 'value',
            seriesField: 'name',
            xAxis: { tickCount: 10 },
            slider: {
                start: 0,
                end: percent,
              },
            legend: {
              position: 'top',
              itemName: {
                formatter: (text) => {
                  return `${text}:${total[text].toFixed(2)}`;
                }
              }
            },
            smooth: true,
            animation: {
              appear: {
                animation: 'path-in',
                duration: 5000,
              },
            },
            annotations: [
              {
                type: 'regionFilter',
                start: ['min', 'median'],
                end: ['max', '0'],
                color: '#F4664A',
              },
              {
                type: 'text',
                position: ['min', 'median'],
                content: '中位数',
                offsetY: -4,
                style: { textBaseline: 'bottom' },
              },
              {
                type: 'line',
                start: ['min', 'median'],
                end: ['max', 'median'],
                style: {
                  stroke: '#F4664A',
                  lineDash: [2, 2],
                },
              },
            ],
          };
        return <Line {...config} />;
    }
}
