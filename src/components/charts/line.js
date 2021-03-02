import React, {PureComponent} from 'react';
import { Line } from '@ant-design/charts';

export default class LineChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state={};
    }

    render() {
        // const data = [
        //     {
        //         year: '2020-01-01',
        //         name: '收入',
        //         value: 1000,
        //     },
        //     {
        //         year: '2020-02-01',
        //         name: '收入',
        //         value: 2000,
        //     },
        //     {
        //         year: '2020-03-01',
        //         name: '收入',
        //         value: 1000,
        //     },
        //     {
        //         year: '2020-01-01',
        //         name: '支出',
        //         value: 100,
        //     },
        //     {
        //         year: '2020-02-01',
        //         name: '支出',
        //         value: 200,
        //     },
        //     {
        //         year: '2020-03-01',
        //         name: '支出',
        //         value: 100,
        //     },
        // ];
        console.log(this.props);
        if (!this.props.data.length){
            return (
                <p>{'暂无数据'}</p>
            );
        }
        const data = [];
        this.props.data.forEach((sheet) => {
            sheet.data.forEach((row) => {
                const columnNames = Object.keys(row);
                for (let index = 1; index < columnNames.length; index += 1) {
                    const element = row[columnNames[index]];
                    data.push({
                        date: row[columnNames[0]],
                        name: columnNames[index],
                        value: element
                    });
                }
            });
        });

        const config = {
            data,
            xField: 'date',
            yField: 'value',
            seriesField: 'name',
            xAxis: { tickCount: 10 },
            slider: {
                start: 0,
                end: 1,
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