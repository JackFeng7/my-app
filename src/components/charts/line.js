import React, {PureComponent} from 'react';
import { Line } from '@ant-design/charts';
import moment from 'moment';

export default class LineChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state={};
    }

    render() {
        if (!this.props.data.length){
            return (
                <p>{'暂无数据'}</p>
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
            legend: { position: 'top' },
            smooth: true,
            animation: {
              appear: {
                animation: 'path-in',
                duration: 5000,
              },
            },
          };
        return <Line {...config} />;
    }
}
